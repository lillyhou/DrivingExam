import React, { useState, useEffect } from "react";
import ModalDialog from "../components/ModalDialog";
import { TodoItem } from "../types/TodoItem";
import { createEmptyErrorResponse, ErrorResponse, isErrorResponse } from "../utils/apiClient";
import { deleteTodo } from "./todoApiClient";

type Props = {
    todo: TodoItem;
    onCancel: () => void;
    onDeleted: () => void;
};

export default function TodosDelete({ todo, onCancel, onDeleted }: Props) {
    const [deleteTasks, setDeleteTasks] = useState(false);
    const [error, setError] = useState<ErrorResponse>(createEmptyErrorResponse());

    useEffect(() => {
        if (error.message) {
            alert(error.message);
        }
    }, [error]);

    async function handleDelete() {
        const response = await deleteTodo(todo.guid, deleteTasks);
        if (isErrorResponse(response)) {
            setError(response);
        } else {
            onDeleted();
        }
    }

    return (
        <ModalDialog
            title={`Todo löschen: ${todo.title}`}
            onCancel={onCancel}
            onOk={handleDelete}
        >
            <p>Möchtest du das Todo "{todo.title}" wirklich löschen?</p>
            <label>
                <input
                    type="checkbox"
                    checked={deleteTasks}
                    onChange={(e) => setDeleteTasks(e.target.checked)}
                />
                Verbundene Tasks ebenfalls löschen
            </label>
        </ModalDialog>
    );
}