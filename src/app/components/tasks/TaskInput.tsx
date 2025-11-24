'use client';

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {logTask, suggestTasks} from "@/lib/api/tasks";
import {useState} from "react";

export default function TaskInput() {

    const [taskName, setTaskName] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const queryClient = useQueryClient();

    const {data: suggestions = []} = useQuery({
        queryKey: ["suggestions", taskName],
        queryFn: () => suggestTasks(taskName),
        placeholderData: (previousData) => previousData
    });

    const mutation = useMutation({
        mutationFn: (taskName: string) => logTask({name: taskName, doneAt: new Date()})
    });

    const showSuggestion = isFocused && suggestions.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(taskName);
        setTaskName("");
    }

    const handleKeydown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    }

    return (
        <div>
            <input type="text"
                   placeholder="Type what you did"
                   onChange={(e) => setTaskName(e.target.value)}
                   onKeyDown={handleKeydown}
                   onFocus={() => setIsFocused(true)}
                   onBlur={() => setIsFocused(false)}
                   value={taskName}
            />
            {showSuggestion && (
                <ul>
                    {suggestions.map(suggestion => (
                        <li key={suggestion.id}>{suggestion.name}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}