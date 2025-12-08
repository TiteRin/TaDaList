import {TaskSuggestion} from "@/domains/tasks/taskService";
import {useEffect, useMemo, useRef, useState} from "react";

interface Props {
    suggestions: TaskSuggestion[];
    onSelect: (suggestionName: string) => void;
}

export default function SuggestionCloud({suggestions, onSelect}: Props) {
    // Stable key for each suggestion (use id, otherwise name-based for globals)
    const keyedSuggestions = useMemo(() =>
        suggestions.map((s) => ({
            key: s.id ?? `global:${s.name}`,
            data: s,
        })), [suggestions]);

    type Phase = 'enter' | 'stay' | 'exit';
    type AnimatedItem = { key: string; data: TaskSuggestion; phase: Phase };

    const [items, setItems] = useState<AnimatedItem[]>(() =>
        keyedSuggestions.map(({key, data}) => ({key, data, phase: 'enter'}))
    );

    const prevKeysRef = useRef<Set<string>>(new Set(items.map(i => i.key)));

    // Diff incoming suggestions to manage enter/exit phases
    useEffect(() => {
        const incomingKeys = new Set(keyedSuggestions.map(k => k.key));
        const prevKeys = prevKeysRef.current;

        setItems((prev) => {
            // Mark exiting for items not present anymore
            const nextMap = new Map<string, AnimatedItem>();
            for (const it of prev) {
                if (!incomingKeys.has(it.key)) {
                    nextMap.set(it.key, {...it, phase: 'exit'});
                } else {
                    nextMap.set(it.key, {...it, phase: 'stay'});
                }
            }
            // Add new items with enter phase and update existing data
            for (const {key, data} of keyedSuggestions) {
                if (!nextMap.has(key)) {
                    nextMap.set(key, {key, data, phase: 'enter'});
                } else {
                    const existing = nextMap.get(key)!;
                    nextMap.set(key, {...existing, data});
                }
            }

            // Preserve previous visual order for existing/exiting items so exits collapse in place.
            const prevOrder = prev.map(p => p.key);
            const ordered: AnimatedItem[] = [];
            for (const k of prevOrder) {
                const it = nextMap.get(k);
                if (it) ordered.push(it);
            }
            // Append any newly entering items in the incoming order
            for (const {key} of keyedSuggestions) {
                if (!prevOrder.includes(key)) {
                    const it = nextMap.get(key);
                    if (it) ordered.push(it);
                }
            }
            return ordered;
        });

        prevKeysRef.current = incomingKeys;
    }, [keyedSuggestions]);

    if (keyedSuggestions.length === 0 && items.length === 0) {
        return null;
    }

    return (
        <div className="suggestion-cloud animate-fade-in w-full flex flex-wrap gap-2 items-center justify-center">
            {items.map((item, index) => (
                <SelectedCloudBadge
                    key={item.key}
                    idStr={item.key}
                    phase={item.phase}
                    onExitAnimationEnd={() => {
                        // Remove item after its exit animation finishes
                        setItems(curr => curr.filter(i => i.key !== item.key));
                    }}
                    onSelect={() => onSelect(item.data.name)}
                    label={item.data.name}
                />
            ))}
        </div>
    )
}

interface PopBadgeProps {
    idStr: string;
    label: string;
    onSelect: () => void;
    phase?: 'enter' | 'stay' | 'exit';
    onExitAnimationEnd?: () => void;
}

function SelectedCloudBadge({idStr, label, onSelect, phase = 'stay', onExitAnimationEnd}: PopBadgeProps) {
    const [popped, setPopped] = useState(false);
    // Keep the badge visually hidden after pop ends to avoid a brief reappearance
    // while the parent is about to trigger the exit animation.
    const [holdHidden, setHoldHidden] = useState(false);
    const holdTimerRef = useRef<number | null>(null);

    // If the item starts exiting at any time, keep it visually hidden until unmount.
    useEffect(() => {
        if (phase === 'exit') {
            setHoldHidden(true);
        }
    }, [phase]);

    // Cleanup any pending timers on unmount to avoid state updates on unmounted component
    useEffect(() => {
        return () => {
            if (holdTimerRef.current) {
                window.clearTimeout(holdTimerRef.current);
                holdTimerRef.current = null;
            }
        };
    }, []);

    function handleClick() {
        // Prevent re-trigger while animation is running
        if (popped) return;
        // Ignore clicks while exiting
        if (phase === 'exit') return;
        // Trigger pop animation and notify parent
        setPopped(true);
        setHoldHidden(true);
        onSelect();
    }

    return (
        <button
            type="button"
            data-id={idStr}
            onClick={handleClick}
            onAnimationEnd={(e) => {
                const name = e.animationName;
                if (name === 'pop-bubble') {
                    // Pop animation finished. If exit hasn't started yet, don't instantly
                    // show the badge again; keep it visually hidden for a short hold so
                    // that parent removal (which usually follows) can start the exit
                    // animation without a flash.
                    setPopped(false);
                    if (phase === 'exit') {
                        // already exiting: keep hidden until unmount
                        setHoldHidden(true);
                    } else {
                        // not exiting yet: keep hidden a bit longer to avoid flash
                        if (holdTimerRef.current) {
                            window.clearTimeout(holdTimerRef.current);
                            holdTimerRef.current = null;
                        }
                        holdTimerRef.current = window.setTimeout(() => {
                            setHoldHidden(false);
                            holdTimerRef.current = null;
                        }, 700); // must be > story's POP_MS+BUFFER_MS (≈470ms)
                    }
                }
                if (name === 'badge-exit') {
                    onExitAnimationEnd?.();
                }
            }}
            className={`badge badge-primary badge-soft badge-xl strike-animate
            relative overflow-hidden flex-initial cursor-pointer transition-transform hover:scale-105 active:scale-95
            ${popped ? "animate-pop-bubble animate-sparkle-burst pointer-events-none" : ""}
            ${!popped && holdHidden ? "pop-hidden pointer-events-none" : ""}
            ${phase === 'enter' ? "animate-badge-enter" : ""}
            ${phase === 'exit' ? "animate-badge-exit pointer-events-none" : ""}`}
        >
            <span className="strike-text">{label}</span>
        </button>
    );
}
