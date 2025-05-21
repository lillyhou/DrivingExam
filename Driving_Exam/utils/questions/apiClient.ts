
import { isQuestions, Questions } from '@/types/Questions';
import { axiosInstance, createErrorResponse, ErrorResponse } from '../apiClient';

/**
 * Fetch questions for a given moduleGuid nd topicGuid
 * @param moduleGuid The GUID and topicGuid
 * @returns Promise of Questions array or ErrorResponse
 */
export async function getQuestions(moduleGuid: string, topicGuid: string): Promise<Questions[] | ErrorResponse> {
  try {
    const response = await axiosInstance.get(`/api/Questions?moduleGuid=${moduleGuid}&topicGuid=${topicGuid}`);
console.log("api response:", response.data);
    return response.data.filter(isQuestions);
  } catch (e) {
    return createErrorResponse(e);
  }
}
