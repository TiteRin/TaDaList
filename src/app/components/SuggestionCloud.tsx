import {TaskSuggestion} from "@/domains/tasks/taskService";

interface Props {
    suggestions: TaskSuggestion[];
    onSelect: (suggestionName: string) => void;
}

export default function SuggestionCloud({suggestions, onSelect}: Props) {
    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className="suggestion-cloud animate-fade-in w-full flex flex-wrap gap-2 items-center justify-center">
            {suggestions.map((suggestion, index) => (
                <button key={suggestion.id || `global-${index}`}
                        type="button"
                        className="badge badge-primary badge-soft badge-xl
                        flex-initial
                        cursor-pointer transition-all hover:scale-105 active:scale-95
                        "
                        onClick={() => onSelect(suggestion.name)}>
                    {suggestion.name}
                </button>
            ))}
        </div>
    )
}
