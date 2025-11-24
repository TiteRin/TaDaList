'use client';

import {useQuery, useQueryClient} from "@tanstack/react-query";
import {suggestTasks} from "@/lib/api/tasks";
import {useState} from "react";

export default function TaskInput() {

    const [taskName, setTaskName] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const queryClient = useQueryClient();

    const {data: suggestions = []} = useQuery({
        queryKey: ["suggestions", taskName],
        queryFn: () => suggestTasks(taskName),
        placeholderData: (previousData) => previousData
    })

    const showSuggestion = isFocused && suggestions.length > 0;

    return (
        <div>
            <input type="text"
                   placeholder="Type what you did"
                   onChange={(e) => setTaskName(e.target.value)}
                   onFocus={() => setIsFocused(true)}
                   onBlur={() => setIsFocused(false)}
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