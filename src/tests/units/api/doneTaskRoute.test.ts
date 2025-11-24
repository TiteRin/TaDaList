import {beforeEach, describe, expect, it, vi} from "vitest";
import {auth} from "@/lib/auth";
import {POST} from "@/app/api/tasks/done/route";
import taskService from "@/domains/tasks/taskService";

vi.mock('next/headers', () => ({headers: vi.fn().mockResolvedValue(new Headers())}));

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn(),
        }
    }
}));

vi.mock('@/domains/tasks/taskService', async () => {
    return {
        default: {
            logTask: vi.fn()
        }
    }
});

describe("POST /api/tasks/done", function () {
    beforeEach(function () {
        vi.clearAllMocks();
    });

    it('retourne 401 si l’utilisateur n’est pas authentifié', async () => {

        // Approach
        (auth.api.getSession as any).mockResolvedValue(null);
        const request = new Request('http://localhost:3000/api/tasks/done', {
            method: 'POST',
            body: JSON.stringify({name: "showered"})
        });

        // Action
        const response = await POST(request);
        const data = await response.json();

        // Assert
        expect(auth.api.getSession).toHaveBeenCalled();
        expect(response.status).toBe(401);
        expect(data.error).toBe("Unauthorized");
    });

    it('retourne 400 si le nom de la tâche est manquant', async () => {

        // Approach
        (auth.api.getSession as any).mockResolvedValue({user: {id: "user-1"}});

        const request = new Request('http://localhost:3000/api/tasks/done', {
            method: 'POST',
            body: JSON.stringify({})
        });

        // Action
        const response = await POST(request);
        const data = await response.json();

        // Assert
        expect(response.status).toBe(400);
        expect(data.error).toBe("Missing task name");
    });

    it('appelle le service et retourne 201 si tout est valide', async () => {

        // Approach
        const now = new Date();
        (auth.api.getSession as any).mockResolvedValue({user: {id: "user-1"}});
        const mockResult = {
            taskId: "task-1",
            taskName: "showered",
            doneTaskId: "done-1",
            doneAt: now
        };
        (taskService.logTask as any).mockResolvedValue(mockResult);

        const request = new Request('http://localhost:3000/api/tasks/done', {
            method: 'POST',
            body: JSON.stringify({name: "showered", doneAt: now})
        });

        // Action
        const response = await POST(request);
        const data = await response.json();

        // Assert
        expect(response.status).toBe(201);
        expect(taskService.logTask).toHaveBeenCalledWith({
            userId: "user-1",
            name: "showered",
            doneAt: now
        });
        expect(data.taskId).toBe("task-1");
    });
});