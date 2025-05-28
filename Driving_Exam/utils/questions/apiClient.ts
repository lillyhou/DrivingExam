
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


/**
 * Submit checked answers to backend and get result
 * @param questionGuid the question GUID
 * @param checkedAnswers an array of selected answers
 * @returns result from backend or ErrorResponse
 */
export async function checkAnswers(
  questionGuid: string,
  checkedAnswers: { guid: string; isChecked: boolean }[]
): Promise<any | ErrorResponse> {
  try {
    const response = await axiosInstance.post(
      `/api/questions/${questionGuid}/checkanswers`,
      { checkedAnswers }
    );
    return response.data;
  } catch (e) {
    return createErrorResponse(e);
  }
}
