import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {describe, it, expect, vi, beforeEach} from "vitest";
import TaskInput from '@/app/components/tasks/TaskInput';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import * as api from '@/lib/api/tasks';
import {logTask, suggestTasks} from "@/lib/api/tasks";
import React from "react";

vi.mock('@/lib/api/tasks', () => ({
    logTask: vi.fn(),
    suggestTasks: vi.fn(),
}));

const createTestQueryClient = () => new QueryClient({
        defaultOptions: {
            queries: {retry: false},
            mutations: {retry: false},
        }
    }
);

function renderWithClient(ui: React.ReactElement) {
    const testQueryClient = createTestQueryClient();
    return render(
        <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
    );
}

it("example test", () => {
    expect(1).toBe(1);
});

describe("TaskInput Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('affiche un champ de saisie', async () => {

        // Approach
        // Action
        renderWithClient(<TaskInput/>);

        // Assert
        expect(screen.getByPlaceholderText(/type what you did/i)).toBeInTheDocument();
    });

    it('appelle suggestTasks quand on tape', async () => {

        // Approach
        (api.suggestTasks as any).mockResolvedValue([
            {id: "task-1", name: "showered", source: "user"},
            {id: "task-2", name: "shoveled the snow", source: "user"}
        ]);

        // Action
        renderWithClient(<TaskInput/>);
        const input = screen.getByPlaceholderText(/type what you did/i);

        fireEvent.focus(input);
        fireEvent.change(input, {target: {value: "sho"}});

        // Assert
        await waitFor(() => {
            expect(api.suggestTasks).toHaveBeenCalledWith("sho")
        });
        expect(await screen.findByText("showered")).toBeInTheDocument();
        expect(await screen.findByText("shoveled the snow")).toBeInTheDocument();
    });

    it('appuyer sur Entrée dans l’input appelle logTask avec le texte saisi', async () => {

        // Approach
        (api.logTask as any).mockResolvedValue({
            taskId: "task-1",
            taskName: "showered",
            doneTaskId: "done-1",
            doneAt: new Date()
        });

        // Action
        renderWithClient(<TaskInput/>);
        const input = screen.getByPlaceholderText(/type what you did/i);

        fireEvent.change(input, {target: {value: "ate a fancy meal"}});
        fireEvent.keyDown(input, {key: "Enter", code: "Enter"});

        // Assert
        await waitFor(() => {
            expect(api.logTask).toHaveBeenCalledWith(expect.objectContaining({name: "ate a fancy meal"}));
        });

        expect(input).toHaveValue("");
    });
})