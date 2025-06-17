import { isQuestions, Questions } from '@/types/Questions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  axiosInstance,
  createErrorResponse,
  ErrorResponse,
} from '../apiClient';

export async function getExamQuestions(
  moduleGuid: string,
  count: number = 20,
  attempt: number = 1
): Promise<Questions[] | ErrorResponse> {
  if (!moduleGuid) {
    return createErrorResponse(new Error('moduleGuid missing'));
  }

  try {
    const token = await AsyncStorage.getItem('accessToken');

    console.log('[Exam] calling endpoint with', { moduleGuid, count, attempt });

    const response = await axiosInstance.get(
      `/api/Questions/exam?moduleGuid=${moduleGuid}&count=${count}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    );

    // Successful fetch
    const filtered = response.data.filter(isQuestions);
    console.log('[Exam] filtered length →', filtered.length);
    return filtered;
  } catch (e: any) {
    /** ----- detailed logging ----- **/
    if (e.response) {
      // Server responded with a status out of 2xx
      console.error('[Exam] axios error →', e.response.status, e.response.data);
      // Retry once on 401 (token race) or 400 “Not enough questions”
      if (
        attempt === 1 &&
        (e.response.status === 401 ||
          e.response.status === 403 ||
          e.response.status === 400)
      ) {
        // 400 → try smaller count; 401/403 → same count but maybe token now present
        const nextCount = e.response.status === 400 ? 10 : count;
        return getExamQuestions(moduleGuid, nextCount, attempt + 1);
      }
    } else if (e.code === 'ECONNABORTED' && attempt === 1) {
      console.warn('[Exam] timeout, retrying once...');
      return getExamQuestions(moduleGuid, count, attempt + 1);
    } else {
      console.error('[Exam] axios error →', e.message || e);
    }

    return createErrorResponse(e);
  }
}
