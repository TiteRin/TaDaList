'use client';

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {logTask, LogTaskPayload, suggestTasks} from "@/lib/api/tasks";
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
        mutationFn: (payload: LogTaskPayload) => logTask(payload),
        onSuccess: () => {
            setTaskName("");
            queryClient.invalidateQueries({queryKey: ["tasks"]})
            queryClient.invalidateQueries({queryKey: ["suggestions"]})
        }
    });

    const showSuggestion = isFocused && suggestions.length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({name: taskName});
    }

    const handleKeydown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        mutation.mutate({name: suggestion});
    }

    return (
        <fieldset className="fieldset">
            <legend className={"fieldset-legend"}>What did you do today?</legend>
            <input type="text"
                   placeholder="Type what you did"
                   onChange={(e) => setTaskName(e.target.value)}
                   onKeyDown={handleKeydown}
                   onFocus={() => setIsFocused(true)}
                   onBlur={() => setTimeout(() => setIsFocused(false), 300)}
                   value={taskName}
                   className="input input-bordered w-full"
            />
            {showSuggestion && (
                <ul className="">
                    {suggestions.map(suggestion => (
                        <li key={suggestion.id} className="cursor-pointer hover:bg-primary badge-xl badge badge-soft badge-secondary m-2"
                            onClick={() => handleSuggestionClick(suggestion.name)}>{suggestion.name}</li>
                    ))}
                </ul>
            )}
        </fieldset>
    )
}