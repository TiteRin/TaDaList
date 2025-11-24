import type {Meta, StoryObj} from '@storybook/react';
import TaskInput from "@/app/components/tasks/TaskInput";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const withQueryClient = (Story: any) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return <QueryClientProvider client={queryClient}><Story/></QueryClientProvider>;
}

const meta: Meta<typeof TaskInput> = {
    title: "Components/TaskInput",
    component: TaskInput,
    decorators: [withQueryClient],
    parameters: {
        layout: "centered"
    }
};

export default meta;
type Story = StoryObj<typeof TaskInput>;
export const Default: Story = {};

