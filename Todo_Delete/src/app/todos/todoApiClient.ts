import { createErrorResponse, ErrorResponse } from "../utils/apiClient";
import axiosInstance from "../utils/axiosInstance";

export async function deleteTodo(guid: string, deleteTasks: boolean): Promise<ErrorResponse | undefined> {
    try {
        await axiosInstance.delete(`/api/TodoItems/${guid}?deleteTasks=${deleteTasks}`);
    } catch (e) {
        return createErrorResponse(e);
    }
}
