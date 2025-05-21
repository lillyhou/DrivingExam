import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { getQuestions } from '@/utils/questions/apiClient';
import { styles } from '@/utils/questions/index.styles';

export default function QuestionScreen() {
  const{topic: moduleGuid, topicGuid, topicName } = useLocalSearchParams();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleGuid || !topicGuid) return;

     //console.log("moduleGuid:", moduleGuid);
  //console.log("topicGuid:", topicGuid);

    async function fetchQuestions() {
      if (typeof moduleGuid !== 'string' || typeof topicGuid !== 'string') {
        setError('Invalid parameters.');
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await getQuestions(moduleGuid, topicGuid);
      //console.log("API result from index file:", result);
      setLoading(false);

      if ('status' in result) {
        setError(result.message);
      } else {
        setQuestions(result);
        setCurrentIndex(0);
        setError(null);
      }
    }

    fetchQuestions();
  }, [moduleGuid, topicGuid]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  if (questions.length === 0) return <Text>No questions found.</Text>;

  const question = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.topicName}>{topicName}</Text>
      <Text style={styles.questionNumber}>Question #{question.number}</Text>
      <Text style={styles.questionText}>{question.text}</Text>

      {question.imageUrl && (
        <Image source={{ uri: question.imageUrl }} style={styles.questionImage} />
      )}

      <View style={styles.answersContainer}>
        {question.answers.map((answer: any) => (
          <View key={answer.guid} style={styles.answerItem}>
            <Text style={styles.answerText}>- {answer.text}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
            styles.nextButton,
            currentIndex === questions.length - 1 && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={currentIndex === questions.length - 1}
        >
        <Text style={styles.nextButtonText}>
          {currentIndex === questions.length - 1 ? 'End' : 'Next'}
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
