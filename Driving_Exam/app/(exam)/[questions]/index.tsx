import { getExamQuestions } from '@/utils/exams/apiClient';
import { checkAnswers } from '@/utils/questions/apiClient';
import { styles } from '@/utils/questions/index.styles';
import { saveExam } from '@/utils/storage/exams';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ExamQuestionScreen() {
   const insets = useSafeAreaInsets(); 
  const { questions: moduleGuidRaw } = useLocalSearchParams();
  const router = useRouter();

  const moduleGuid = Array.isArray(moduleGuidRaw) ? moduleGuidRaw[0] : moduleGuidRaw;

  const [ready, setReady] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, Record<string, boolean>>>({});
  const [finalResults, setFinalResults] = useState<{
    totalPoints: number;
    maxPoints: number;
    results: {
      questionGuid: string;
      isCorrect: boolean;
      correctAnswers: Record<string, boolean>;
    }[];
  } | null>(null);

  // Check if param is valid, then mark ready
  useEffect(() => {
    if (typeof moduleGuid === 'string' && moduleGuid.length > 0 && moduleGuid !== 'redirect') {
      setReady(true);
    } else if (moduleGuid === 'redirect') {
      router.replace('/(exam)');
    }
  }, [moduleGuid, router]);

  // Fetch questions once ready
  useEffect(() => {
    if (!ready) return;

    async function fetchExamQuestions() {
      setLoading(true);
      const result = await getExamQuestions(moduleGuid as string);
      setLoading(false);

      if ('status' in result) {
        setError(result.message);
      } else {
        setQuestions(result);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setFinalResults(null);
        setError(null);
      }
    }

    fetchExamQuestions();
  }, [ready, moduleGuid]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  if (questions.length === 0) return <Text>No questions found.</Text>;

  const question = questions[currentIndex];

  const toggleAnswer = (questionGuid: string, answerGuid: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionGuid]: {
        ...prev[questionGuid],
        [answerGuid]: !prev[questionGuid]?.[answerGuid],
      },
    }));
  };

  const handleNext = () => {
    setCurrentIndex((i) => i + 1);
  };

  const handleFinalSubmit = async () => {
    let totalPoints = 0;
    let maxPoints = 0;
    let results: {
      questionGuid: string;
      isCorrect: boolean;
      correctAnswers: Record<string, boolean>;
    }[] = [];

    for (const question of questions) {
      const questionAnswers = selectedAnswers[question.guid] || {};
      const checkedAnswers = question.answers.map((a: any) => ({
        guid: a.guid,
        isChecked: questionAnswers[a.guid] === true,
      }));

      const result = await checkAnswers(question.guid, checkedAnswers);
      if ('status' in result && result.status >= 400) {
        Alert.alert('Error', result.message);
        return;
      }

      totalPoints += result.pointsReached;
      maxPoints += result.pointsReachable;
      const isCorrect = result.pointsReached === result.pointsReachable;
      results.push({
        questionGuid: question.guid,
        isCorrect,
        correctAnswers: result.checkResult,
      });
    }

    setFinalResults({ totalPoints, maxPoints, results });

    const timestamp = new Date().toISOString();
    const accessToken = await AsyncStorage.getItem('accessToken');

    const details = questions.map((q) => {
      const sel = selectedAnswers[q.guid] || {};
      const selectedArr = q.answers
        .filter((a: any) => sel[a.guid])
        .map((a: any) => a.text);
      const resultForQ = results.find((r) => r.questionGuid === q.guid);

      const correctAnswersObj = resultForQ?.correctAnswers || {};
      const correctArr = q.answers
        .filter((a: any) => correctAnswersObj[a.guid] === true)
        .map((a: any) => a.text);

      return {
        questionText: q.text,
        isCorrect: resultForQ?.isCorrect ?? false,
        selectedAnswers: selectedArr,
        correctAnswers: correctArr,
      };
    });

    await saveExam({
      id: timestamp,
      totalPoints,
      maxPoints,
      moduleGuid: Array.isArray(moduleGuid) ? moduleGuid[0] : moduleGuid,
      userToken: accessToken ?? undefined,
      details,
    });
  };

  return (
    <ScrollView style={styles.container}
    contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
      <Text style={styles.questionNumber}>Question #{question.number}</Text>
      <Text style={styles.questionText}>{question.text}</Text>

      {question.imageUrl && (
        <Image source={{ uri: question.imageUrl }} style={styles.questionImage} />
      )}

      <View style={styles.answersContainer}>
        {question.answers.map((answer: any) => {
          const isSelected = selectedAnswers[question.guid]?.[answer.guid] === true;
          return (
            <TouchableOpacity
              key={answer.guid}
              style={[styles.answerItem, isSelected && { backgroundColor: '#ede46b' }]}
              onPress={() => toggleAnswer(question.guid, answer.guid)}
            >
              <Text style={styles.answerText}>
                {isSelected ? '☑' : '☐'} {answer.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.nextButton]}
        onPress={currentIndex === questions.length - 1 ? handleFinalSubmit : handleNext}
      >
        <Text style={styles.nextButtonText}>
          {currentIndex === questions.length - 1 ? 'Submit Exam' : 'Next'}
        </Text>
      </TouchableOpacity>

      {finalResults && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
            Final Score: {finalResults.totalPoints} / {finalResults.maxPoints}
          </Text>

          {finalResults.results.map((r, i) => {
            const question = questions.find((q) => q.guid === r.questionGuid);
            const selected = selectedAnswers[r.questionGuid] || {};
            const correct = r.correctAnswers || {};

            return (
              <View key={r.questionGuid} style={{ marginBottom: 15 }}>
                <Text style={{ fontWeight: 'bold' }}>
                  Q{i + 1}: {r.isCorrect ? '✔ Correct' : '✖ Incorrect'}
                </Text>
                <Text style={{ marginBottom: 5 }}>{question?.text}</Text>

                {question?.answers.map((answer: any) => {
                  const isSelected = selected[answer.guid] === true;
                  const isCorrect = correct[answer.guid] === true;

                  return (
                    <Text
                      key={answer.guid}
                      style={{
                        paddingLeft: 10,
                        color: isCorrect ? 'green' : isSelected ? 'red' : '#444',
                        fontWeight: isSelected ? 'bold' : 'normal',
                      }}
                    >
                      {isSelected ? '☑' : '☐'} {answer.text} {isCorrect ? '✅' : ''}
                    </Text>
                  );
                })}
              </View>
            );
          })}
        </View>
      )}

      {currentIndex === questions.length - 1 && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.push({
              pathname: '/(exam)',
              params: {
                moduleGuid: Array.isArray(moduleGuid) ? moduleGuid[0] : moduleGuid,
                name: 'Exam Simulation',
              },
            })
          }
        >
          <Text style={styles.backButtonText}>Back to Exam Modules</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
