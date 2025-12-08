import type {Meta, StoryObj} from '@storybook/react';
import TaskInput from "@/app/components/tasks/TaskInput";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {http, HttpResponse} from 'msw';
import {userEvent, within} from 'storybook/test';

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

export const WithSuggestions: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get('/api/tasks/suggestions', ({request}) => {
                    const url = new URL(request.url);
                    const query = url.searchParams.get('q');

                    if (query === 'fail') {
                        return new HttpResponse(null, {status: 500});
                    }

                    return HttpResponse.json([
                        {id: "task-1", name: "showered", source: "user"},
                        {id: "task-2", name: "went shopping", source: "user"},
                        {id: null, name: "shaved", source: "global"},
                        {id: "task-4", name: "shoveled snow", source: "user"},
                        {id: "task-7", name: "showed some work", source: "user"},
                        {id: "task-11", name: "shipped gifts", source: "user"},
                        {id: "task-12", name: "shared insights with my therapist", source: "user"},
                    ]);
                }),
                http.post('/api/tasks/done', () => {
                    return HttpResponse.json({success: true});
                })
            ]
        }
    },
    play: async ({canvasElement}) => {
        const canvas = within(canvasElement);
        const input = canvas.getByPlaceholderText(/type what you did/i);

        await userEvent.click(input);
        await userEvent.type(input, "sh");
    }
};
