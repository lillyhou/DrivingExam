import { loadExams, StoredExam } from '@/utils/storage/exams';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function MyExamsScreen() {
  const [exams, setExams] = useState<StoredExam[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadExams().then(setExams);
    }, [])
  );

  if (!exams.length) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No exams saved yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 20 }}
      data={exams}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item }) => {
        const date = new Date(item.id).toLocaleString();
        const pct  = Math.round((item.totalPoints / item.maxPoints) * 100);
        return (
          <TouchableOpacity
            style={{
              padding: 16,
              borderRadius: 8,
              backgroundColor: '#f2f2f2',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{date}</Text>
            <Text style={{ marginTop: 4 }}>
              Score: {item.totalPoints}/{item.maxPoints} ({pct}%)
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}
