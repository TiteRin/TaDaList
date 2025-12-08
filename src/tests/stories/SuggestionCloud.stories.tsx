import type {Meta, StoryObj} from '@storybook/react';
import SuggestionCloud from "@/app/components/SuggestionCloud";
import {TaskSuggestion} from "@/domains/tasks/taskService";
import {useMemo, useState} from "react";

const meta: Meta<typeof SuggestionCloud> = {
    title: "Components/SuggestionCloud",
    component: SuggestionCloud,
    parameters: {
        layout: "centered"
    }
};

const suggestions: TaskSuggestion[] = [
    {id: "task-1", name: "talked to a friend", source: "user"},
    {id: "task-2", name: "fed the cats", source: "user"},
    {id: "task-3", name: "ran errands", source: "user"},
    {id: "task-4", name: "cleaned the litterboxes", source: "user"},
    {id: null, name: "took my meds", source: "global"},
    {id: null, name: "did the dishes", source: "global"},
    {id: "task-5", name: "made some soup", source: "user"},
    {id: "task-6", name: "called the hotline", source: "user"},
    {id: "task-7", name: "worked on my project", source: "user"}
];

export default meta;
type Story = StoryObj<typeof SuggestionCloud>;
export const Default: Story = {
    args: {
        onSelect: (taskName: string) => {
            console.log(`Selected ${taskName}`);
        },
        suggestions
    }
};

function StatefulWrapper() {

    const POP_MS = 420; // keep in sync with .animate-pop-bubble
    const BUFFER_MS = 50; // safety margin

    const [items, setItems] = useState<TaskSuggestion[]>(suggestions);

    const keyOf = (item: TaskSuggestion) => item.id ?? `global:${item.name}`;

    const removeByKey = (key: string) => {
        setItems(curr => curr.filter(s => keyOf(s) !== key));
    }

    const removeRandom = () => {
        setItems(curr => {
            if (curr.length === 0) return curr;

            const i = Math.floor(Math.random() * curr.length);
            return curr.filter((_, index) => index !== i);
        });
    }

    const reset = () => setItems(suggestions);

    const onSelect = (taskName: string) => {
        setTimeout(
            () => setItems(curr => curr.filter(s => s.name !== taskName)),
            POP_MS + BUFFER_MS
        );
    }

    const keys = useMemo(() => items.map(keyOf), [items]);

    return (
        <div className="flex flex-col gap-4 items-center">
            <div className="flex gap-2">
                <button className="btn btn-secondary btn-soft" onClick={removeRandom} disabled={items.length === 0}>
                    Remove random
                </button>
                <button className="btn" onClick={reset}>
                    Reset
                </button>
            </div>
            <SuggestionCloud suggestions={items} onSelect={onSelect}/>
            <div className="text-xs opacity-60">Keys: {keys.join(", ")}</div>
        </div>
    );
}

export const RemovalsDemo: Story = {
    render: () => <StatefulWrapper/>
}