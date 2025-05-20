import type { Topics } from '@/types/Topics';
import { getTopics } from '@/utils/topics/apiClient';
import { styles } from '@/utils/topics/index.styles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function TopicScreen() {
  const router = useRouter();  
  const { topic: moduleGuid } = useLocalSearchParams(); 
  const [topics, setTopics] = useState<Topics[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleGuid) return;  

    async function fetchTopics() {
      const param = Array.isArray(moduleGuid) ? moduleGuid[0] : moduleGuid;
      const result = await getTopics(param);
      if ('status' in result) {
        // It's an ErrorResponse
        setError(result.message);
      } else {
        setTopics(result);
        setError(null);
      }
    }

    fetchTopics();
  }, [moduleGuid]);  

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

const onPressTopic = (topicGuid: string) => {
  const topicParam = Array.isArray(moduleGuid) ? moduleGuid[0] : moduleGuid;
  router.push({
    pathname: "/(modules)/[topic]/questions",
    params: { topic: topicParam, topicGuid },
  });
};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Topics:</Text>
      <FlatList
        data={topics}
        keyExtractor={(item) => item.guid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.topicItem}
            onPress={() => onPressTopic(item.guid)}
          >
            <Text style={styles.topicText}>
              {item.name} ({item.questionCount} questions)
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
