import {TaskSuggestion} from "@/domains/tasks/taskService";
import {useState} from "react";

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
                <SelectedCloudBadge
                    key={suggestion.id || `global-${index}`}
                    idStr={suggestion.id || `global-${index}`}
                    onSelect={() => onSelect(suggestion.name)}
                    label={suggestion.name}
                />
            ))}
        </div>
    )
}

interface PopBadgeProps {
    idStr: string;
    label: string;
    onSelect: () => void;
}

function SelectedCloudBadge({idStr, label, onSelect}: PopBadgeProps) {
    const [popped, setPopped] = useState(false);

    function handleClick() {
        // Prevent re-trigger while animation is running
        if (popped) return;
        // Trigger pop animation and notify parent
        setPopped(true);
        onSelect();
    }

    return (
        <button
            type="button"
            data-id={idStr}
            onClick={handleClick}
            onAnimationEnd={(e) => {
                // Only reset after our pop animation completes
                if (e.animationName === 'pop-bubble') {
                    setPopped(false);
                }
            }}
            className={`badge badge-primary badge-soft badge-xl strike-animate
            relative overflow-visible flex-initial cursor-pointer transition-transform hover:scale-105 active:scale-95
            ${popped ? "animate-pop-bubble animate-sparkle-burst pointer-events-none" : ""}`}
        >
            <span className="strike-text">{label}</span>
        </button>
    );
}
