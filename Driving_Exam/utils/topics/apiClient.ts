
import { isTopics, Topics } from '@/types/Topics';
import { axiosInstance, createErrorResponse, ErrorResponse } from '../apiClient';

/**
 * Fetch topics for a given moduleGuid.
 * @param moduleGuid The GUID of the module to get topics for
 * @returns Promise of Topics array or ErrorResponse
 */
export async function getTopics(moduleGuid: string): Promise<Topics[] | ErrorResponse> {
  try {
    const response = await axiosInstance.get(`api/Topics?assignedModule=${moduleGuid}`);
    // Validate data type, filter for Topics if needed
    return response.data.filter(isTopics);
  } catch (e) {
    return createErrorResponse(e);
  }
}
