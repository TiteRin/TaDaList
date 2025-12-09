'use client';

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {logTask, LogTaskPayload, suggestTasks} from "@/lib/api/tasks";
import {useState} from "react";
import {clsx} from "clsx";
import {useDebounced} from "@/app/hooks/useDebounced";
import {useAnimatedPlaceholder} from "@/app/hooks/useAnimatedPlaceholder";
import {RawStep} from "@/app/hooks/placeholder-animation/utils";

interface Props {
    animatedPlaceholderScripts?: RawStep[][];
}

export default function TaskInput(
    {animatedPlaceholderScripts}: Props = {animatedPlaceholderScripts: undefined}
) {

    const {placeholder, stop} = useAnimatedPlaceholder(animatedPlaceholderScripts);
    const [taskName, setTaskName] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const queryClient = useQueryClient();
    const debouncedTaskName = useDebounced(taskName.trim(), 200);

    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const listBoxId = "task-suggestions";

    const {data: suggestions = [], isFetching} = useQuery({
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
            <div className="relative group">
                <input type="text"
                       placeholder={placeholder}
                       onChange={(e) => setTaskName(e.target.value)}
                       onKeyDown={handleKeydown}
                       onFocus={() => setIsFocused(true)}
                       onBlur={() => setTimeout(() => setIsFocused(false), 300)}
                       value={taskName}
                       className={clsx(
                           "input input-bordered w-full outline-none",
                           {'rounded-b-none border-b-0': showSuggestion})
                       }
                       role="combobox"
                       data-testid="task-input"
                       aria-autocomplete="list"
                       aria-controls={listBoxId}
                       aria-expanded={showSuggestion}
                       aria-activedescendant={showSuggestion && activeIndex >= 0 ? `${listBoxId}__${suggestions[activeIndex].id ?? 'global'}-${suggestions[activeIndex].name}` : undefined}
                />
                {showSuggestion && (
                    <ul id={listBoxId} role="listbox"
                        className="absolute z-20 top-full left-0 w-full bg-base-100 border border-t-0 rounded-b-xl shadow-xl max-h-64 overflow-auto"
                    >
                        {isFetching && (
                            <li className="px-3 py-2 text-sm text-base-content/70">Searching…</li>
                        )}
                        {suggestions.map((suggestion, index) => {
                            const key = `${suggestion.id ?? 'global'}-${suggestion.name}`;
                            const isActive = index === activeIndex;
                            return (
                                <li key={key} id={`${listBoxId}__${key}`} role="option" aria-selected={isActive}>
                                    <button type="button"
                                            className={clsx("w-full text-left px-3 py-2 hover:bg-base-200", {'bg-base-200': isActive})}
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
            </div>
        </fieldset>
    )
}