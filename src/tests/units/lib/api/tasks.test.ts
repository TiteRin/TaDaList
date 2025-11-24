import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {logTask, suggestTasks} from '@/lib/api/tasks';

const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('API Client: tasks', () => {

    beforeEach(() => {
        fetchMock.mockReset();
    });

    describe("logTask", () => {

        it('appelle POST /api/task/done avec les bonnes données', async () => {

            // Approach
            fetchMock.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({taskId: "task-1"})
            });
            const payload = {name: "showered", doneAt: new Date()};

            // Action
            await logTask(payload);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith("/api/tasks/done", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: "showered",
                    doneAt: payload.doneAt.toISOString()
                })
            });
        });

        it('lance une erreur si la requête échoue', async () => {

            // Approach
            fetchMock.mockResolvedValue({
                ok: false,
                status: 500
            });

            // Action

            // Assert
            await expect(logTask({name: "fail"})).rejects.toThrow("Failed to log task");
        });
    });

    describe("getSuggestions", () => {
        it('appelle GET /api/tasks/suggestions avec le paramètre de recherche', async () => {

            // Approach
            fetchMock.mockResolvedValue({
                    ok: true,
                    json: () => Promise.resolve([])
                }
            )

            // Action
            await suggestTasks("sho");

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/api/tasks/suggestions?q=sho"));
        });
    });
});