import { checkAnswers, getQuestions } from '@/utils/questions/apiClient';
import { styles } from '@/utils/questions/index.styles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function QuestionScreen() {
  const { topic: moduleGuid, topicGuid, topicName } = useLocalSearchParams();
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, boolean>>({});
  const [submissionResult, setSubmissionResult] = useState<string | null>(null);
  const [lastCheckResult, setLastCheckResult] = useState<Record<string, boolean> | null>(null);

  useEffect(() => {
    if (!moduleGuid || !topicGuid) return;

    async function fetchQuestions() {
      if (typeof moduleGuid !== 'string' || typeof topicGuid !== 'string') {
        setError('Invalid parameters.');
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await getQuestions(moduleGuid, topicGuid);
      setLoading(false);

      if ('status' in result) {
        setError(result.message);
      } else {
        setQuestions(result);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setSubmissionResult(null);
        setLastCheckResult(null);
        setError(null);
      }
    }

    fetchQuestions();
  }, [moduleGuid, topicGuid]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  if (questions.length === 0) return <Text>No questions found.</Text>;

  const question = questions[currentIndex];

  const toggleAnswer = (guid: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [guid]: !prev[guid],
    }));
  };

  const handleSubmit = async () => {
    const checkedAnswers = question.answers.map((a: any) => ({
      guid: a.guid,
      isChecked: selectedAnswers[a.guid] === true,
    }));

    console.log('Submitting answers:', checkedAnswers);
    const result = await checkAnswers(question.guid, checkedAnswers);
    console.log('API result:', result);

    if ('status' in result && result.status >= 400) {
      Alert.alert('Error', result.message);
      return;
    }

    const pointsReceived = result.pointsReached;
    const fullPoints = result.pointsReachable;

    setSubmissionResult(
      pointsReceived === fullPoints
        ? `✅ Correct! You got ${pointsReceived}/${fullPoints} points.`
        : `❌ Incorrect. You got ${pointsReceived}/${fullPoints} points.`
    );

    setLastCheckResult(result.checkResult);
  };

  const handleNext = () => {
    setCurrentIndex((i) => i + 1);
    setSelectedAnswers({});
    setSubmissionResult(null);
    setLastCheckResult(null);
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
        {question.answers.map((answer: any) => {
          const isSelected = selectedAnswers[answer.guid] === true;
          const wasCorrect = lastCheckResult?.[answer.guid];
          return (
            <TouchableOpacity
              key={answer.guid}
              style={[
                styles.answerItem,
                isSelected && { backgroundColor: '#ede46b' },
              ]}
              onPress={() => toggleAnswer(answer.guid)}
              disabled={lastCheckResult !== null}
            >
              <Text style={styles.answerText}>
                {isSelected ? '☑' : '☐'} {answer.text}
              </Text>
              {lastCheckResult && (
                <Text style={{ fontSize: 12, color: wasCorrect ? 'green' : 'red' }}>
                  {wasCorrect ? '✔ Correct' : '✖ Incorrect'}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {!submissionResult && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}

      {submissionResult && (
        <Text style={{ marginTop: 10, fontSize: 18,  marginBottom: 5 }}>{submissionResult}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.nextButton,
          currentIndex === questions.length - 1 && styles.disabledButton,
        ]}
        onPress={handleNext}
        disabled={currentIndex === questions.length - 1}
      >
        <Text style={styles.nextButtonText}>
          {currentIndex === questions.length - 1 ? 'End' : 'Next'}
        </Text>
      </TouchableOpacity>

      {currentIndex === questions.length - 1 && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.push({
              pathname: '/(modules)/[topic]',
              params: {
                topic: Array.isArray(moduleGuid) ? moduleGuid[0] : moduleGuid,
                name: topicName,
              },
            })
          }
        >
          <Text style={styles.backButtonText}>Back to Topics</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
