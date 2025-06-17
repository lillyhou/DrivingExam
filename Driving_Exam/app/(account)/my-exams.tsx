import { loadExams, saveExams, StoredExam } from '@/utils/storage/exams';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';

/* ----------  Small card component  ---------- */
const ExamCard: React.FC<{
  item: StoredExam;
  onDelete: (id: string) => void;
}> = ({ item, onDelete }) => {
  const [open, setOpen] = useState(false);

  const date = new Date(item.id).toLocaleString();
  const pct = Math.round((item.totalPoints / item.maxPoints) * 100);
  const triangle = open ? '▼' : '▶';

  return (
    <TouchableOpacity
      onPress={() => setOpen(!open)}
      activeOpacity={0.8}
      style={{
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#f2f2f2',
      }}
    >
      {/* --- summary row with triangle icon --- */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{date}</Text>
        <Text style={{ fontSize: 18 }}>{triangle}</Text>
      </View>

      <Text style={{ marginTop: 4 }}>
        Score: {item.totalPoints}/{item.maxPoints} ({pct}%)
      </Text>

      {/* --- details (collapsed by default) --- */}
      {open && item.details && (
        <View style={{ marginTop: 12 }}>
          {item.details.map((d, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: '600' }}>
                Q{i + 1}: {d.isCorrect ? '✔ Correct' : '✖ Incorrect'}
              </Text>
              <Text>{d.questionText}</Text>
              <Text style={{ color: '#444', marginLeft: 6 }}>
                Your answers: {d.selectedAnswers.join(', ') || '—'}
              </Text>
              {!d.isCorrect && (
                <Text style={{ color: 'green', marginLeft: 6 }}>
                  Correct answers: {d.correctAnswers.join(', ')}
                </Text>
              )}
            </View>
          ))}

          {/* --- delete button --- */}
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Delete Exam',
                'Are you sure you want to delete this exam result?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) },
                ]
              )
            }
            style={{
              marginTop: 12,
              alignSelf: 'flex-start',
              backgroundColor: '#ff6666',
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>🗑 Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};
/* ----------  /ExamCard  ---------- */

export default function MyExamsScreen() {
  const [exams, setExams] = useState<StoredExam[]>([]);

  // Load exams when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadExams().then(setExams);
    }, [])
  );

  const handleDelete = async (id: string) => {
    const updated = exams.filter((e) => e.id !== id);
    setExams(updated);
    await saveExams(updated);
  };

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
      renderItem={({ item }) => (
        <ExamCard item={item} onDelete={handleDelete} />
      )}
       ListHeaderComponent={
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 14 }}>
        My Exams
      </Text>
    }
    />
  );
}
