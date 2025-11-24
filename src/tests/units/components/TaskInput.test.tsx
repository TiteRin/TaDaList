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
})