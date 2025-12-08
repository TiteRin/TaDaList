'use client';

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {logTask, LogTaskPayload, suggestTasks} from "@/lib/api/tasks";
import {useEffect, useState} from "react";
import SuggestionCloud from "@/app/components/SuggestionCloud";
import {clsx} from "clsx";
import {useDebounced} from "@/app/hooks/useDebounced";

export default function TaskInput() {

    const [taskName, setTaskName] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const queryClient = useQueryClient();
    const debouncedTaskName = useDebounced(taskName.trim(), 200);

    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const listBoxId = "task-suggestions";

    const {data: suggestions = []} = useQuery({
        queryKey: ["suggestions", debouncedTaskName],
        queryFn: () => suggestTasks(debouncedTaskName),
        placeholderData: (previousData) => previousData,
        enabled: debouncedTaskName.length > 0
    });

    const mutation = useMutation({
        mutationFn: (payload: LogTaskPayload) => logTask(payload),
        onSuccess: () => {
            setTaskName("");
            queryClient.invalidateQueries({queryKey: ["tasks"]})
            queryClient.invalidateQueries({queryKey: ["suggestions"]})
        }
    });

    const showSuggestion = isFocused && (debouncedTaskName ?? taskName).length > 0 && suggestions.length > 0;

    const handleSubmit = (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        mutation.mutate({name: trimmed});
    }

    const handleKeydown = (e: React.KeyboardEvent) => {

        switch (e.key) {
            case "Enter":
                e.preventDefault();
                if (showSuggestion && activeIndex >= 0) {
                    handleSubmit(suggestions[activeIndex].name);
                } else {
                    handleSubmit(taskName);
                }
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex(Math.max(activeIndex - 1, 0));
                break;
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex(Math.min(activeIndex + 1, suggestions.length - 1));
                break;
            case "Escape":
                setActiveIndex(-1);
                setIsFocused(false);
                break;
        }
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
                   role="combobox"
                   aria-autocomplete="list"
                   aria-controls={listBoxId}
                   aria-expanded={showSuggestion}
                   aria-activedescendant={showSuggestion && activeIndex >= 0 ? `${listBoxId}__${suggestions[activeIndex].id ?? 'global'}-${suggestions[activeIndex].name}` : undefined}
            />
            {showSuggestion && (
                <ul id={listBoxId} role="listbox"
                    className="menu bg-base-100 rounded-box shadow-lg mt-2 max-h-60 overflow-auto">
                    {suggestions.map((suggestion, index) => {
                        const key = `${suggestion.id ?? 'global'}-${suggestion.name}`;
                        const isActive = index === activeIndex;
                        return (
                            <li key={key} id={`${listBoxId}__${key}`} role="option" aria-selected={isActive}>
                                <button type="button"
                                        className={clsx("w-full text-left px-3 py-2", {'bg-base-200': isActive})}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => {
                                            setTaskName(suggestion.name);
                                            setIsFocused(false);
                                            handleSubmit(suggestion.name)
                                        }}
                                        title={suggestion.name}>
                                    {suggestion.name}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </fieldset>
    )
}