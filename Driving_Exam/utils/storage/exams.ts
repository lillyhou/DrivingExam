import AsyncStorage from '@react-native-async-storage/async-storage';

export type StoredExam = {
  id: string;
  totalPoints: number;
  maxPoints: number;
  moduleGuid: string;
  userToken?: string;

  details: {
    questionText: string;
    isCorrect: boolean;
    selectedAnswers: string[];
    correctAnswers: string[];
  }[];
};

const KEY = 'MY_EXAMS';

// Load all exams from storage
export async function loadExams(): Promise<StoredExam[]> {
  const json = await AsyncStorage.getItem(KEY);
  return json ? JSON.parse(json) : [];
}

// Save a new exam (adds to the top)
export async function saveExam(result: StoredExam) {
  try {
    const token = await AsyncStorage.getItem('accessToken');

    const newResult: StoredExam = {
      ...result,
      userToken: token ?? undefined,
    };

    const all = await loadExams();
    all.unshift(newResult); // newest first
    await AsyncStorage.setItem(KEY, JSON.stringify(all));
  } catch (error) {
    console.error("Error saving exam:", error);
  }
}

// Overwrite the entire list (used for delete or batch update)
export async function saveExams(exams: StoredExam[]) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(exams));
  } catch (error) {
    console.error("Error saving exams:", error);
  }
}

// Delete an exam by its ID
export async function deleteExamById(id: string) {
  try {
    const all = await loadExams();
    const filtered = all.filter((e) => e.id !== id);
    await saveExams(filtered);
  } catch (error) {
    console.error("Error deleting exam:", error);
  }
}
