'use client';

import React, { useEffect, useReducer, useState } from "react";
import { TodoItem } from "../types/TodoItem";
import styles from "./style.module.css";
import TodosDelete from "./TodosDelete";

type Action =
    | { type: "delete"; todo: TodoItem }
    | { type: "cancel" };

type State =
    | { actionType: "delete"; todo: TodoItem }
    | { actionType: null };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "delete":
            return { actionType: "delete", todo: action.todo };
        case "cancel":
            return { actionType: null };
        default:
            return state;
    }
}

export default function TodosClient() {
    const [state, dispatch] = useReducer(reducer, { actionType: null });
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTodos() {
            try {
                const response = await fetch("https://localhost:5443/api/TodoItems");
                const data = await response.json();
                setTodoItems(data);
            } catch (error) {
                console.error("Fehler beim Laden der Todos:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTodos();
    }, []);

    if (loading) {
        return <p>Lädt Todos...</p>;
    }

    return (
        <div className={styles.categories}>
            <h1>Todo Liste</h1>
            <ul>
                {todoItems.map(item => (
                    <li key={item.guid}>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        <p>Status: {item.isCompleted ? "Abgeschlossen" : "Ausstehend"}</p>
                        <button
                            className={styles.deleteButton}
                            onClick={() => dispatch({ type: "delete", todo: item })}
                        >
                            🗑️ Löschen
                        </button>
                    </li>
                ))}
            </ul>
            {state.actionType === "delete" && (
                <TodosDelete
                    todo={state.todo}
                    onCancel={() => dispatch({ type: "cancel" })}
                    onDeleted={() => dispatch({ type: "cancel" })}
                />
            )}
        </div>
    );
}
