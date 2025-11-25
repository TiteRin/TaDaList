import type {Meta, StoryObj} from '@storybook/react';
import SuggestionCloud from "@/app/components/SuggestionCloud";

const meta: Meta<typeof SuggestionCloud> = {
    title: "Components/SuggestionCloud",
    component: SuggestionCloud,
    parameters: {
        layout: "centered"
    }
};

export default meta;
type Story = StoryObj<typeof SuggestionCloud>;
export const Default: Story = {
    args: {
        suggestions: [],
        onSelect: (taskName: string) => {}
    }
};

export const WithSuggestions: Story = {
    args: {
        onSelect: (taskName: string) => {},
        suggestions: [
            {id: "task-1", name: "talked to a friend", source: "user"},
            {id: "task-2", name: "fed the cats", source: "user"},
            {id: "task-3", name: "ran errands", source: "user"},
            {id: "task-4", name: "cleaned the litterboxes", source: "user"},
            {id: null, name: "took my meds", source: "global"},
            {id: null, name: "did the dishes", source: "global"},
            {id: "task-5", name: "made some soup", source: "user"},
            {id: "task-6", name: "called the hotline", source: "user"},
            {id: "task-7", name: "worked on my project", source: "user"}
        ]
    }
};