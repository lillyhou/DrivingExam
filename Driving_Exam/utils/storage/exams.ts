import AsyncStorage from '@react-native-async-storage/async-storage';

export type StoredExam = {
  id: string;                
  totalPoints: number;
  maxPoints: number;
  moduleGuid: string;
};

const KEY = 'MY_EXAMS';

export async function loadExams(): Promise<StoredExam[]> {
  const json = await AsyncStorage.getItem(KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveExam(result: StoredExam) {
  const all = await loadExams();
  all.unshift(result);                    // newest first
  await AsyncStorage.setItem(KEY, JSON.stringify(all));
}
