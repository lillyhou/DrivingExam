import { isQuestions, Questions } from '@/types/Questions';
import { axiosInstance, createErrorResponse, ErrorResponse } from '../apiClient';

export async function getExamQuestions(moduleGuid: string): Promise<Questions[] | ErrorResponse> {
  try {
    const response = await axiosInstance.get(`/api/Questions/exam?moduleGuid=${moduleGuid}&count=20`);
    return response.data.filter(isQuestions);
  } catch (e) {
    return createErrorResponse(e);
  }
}