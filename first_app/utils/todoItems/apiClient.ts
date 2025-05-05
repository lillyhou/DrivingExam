import { TodoItem, isTodoItem } from '@/types/TodoItem';
import { axiosInstance, createErrorResponse, ErrorResponse } from '@/utils/apiClient';

export async function getTodoItems(): Promise<TodoItem[] | ErrorResponse> {
  try {
    const response = await axiosInstance.get<TodoItem[]>("api/TodoItems");
    return response.data.filter(isTodoItem);
  } catch (e) {
    return createErrorResponse(e);
  }
}