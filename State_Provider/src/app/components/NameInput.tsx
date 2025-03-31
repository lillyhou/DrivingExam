"use client";

import { useState } from "react";
import ModalDialog from "./ModalDialog";
import { useTodoAppState } from "@/app/context/TodoAppContext";

export default function NameInput() {
    const [name, setName] = useState("");
    const todoAppState = useTodoAppState();

    const handleOk = () => {
        todoAppState.actions.setActiveUser(name.trim() || "Guest");
    };
    const handleCancel = () => {
        todoAppState.actions.setActiveUser("Guest");
    };

    
    return (
        <ModalDialog title="Enter Your Name" onOk={handleOk} onCancel={handleCancel}>
            <input
                type="text"
                placeholder="Please write your name here."
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </ModalDialog>
    );
}
