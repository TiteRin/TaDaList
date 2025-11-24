import {beforeEach, describe, expect, it, vi} from "vitest"
import {auth} from "@/lib/auth";
import { GET } from '@/app/api/tasks/suggestions/route';
import taskService from "@/domains/tasks/taskService";
import {NextRequest} from "next/server";

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers())
}));

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn()
        }
    }
}));

vi.mock('@/domains/tasks/taskService', async () => ({
    default: {
        suggestTasks: vi.fn()
    }
}));

describe("GET /api/tasks/suggestions", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('retourne 401 si non authentifié', async () => {

        // Approach
        (auth.api.getSession as any).mockResolvedValue(null);
        const request = new NextRequest('http://localhost:3000/api/tasks/suggestions?q=sho');

        // Action
        const response = await GET(request);
        const data = await response.json();

        // Assert
        expect(response.status).toBe(401);
        expect(data.error).toBe("Unauthorized");
    });

    it('appelle le service avec la query et l’identifiant de l’utilisateur', async () => {

        // Approach
        const userId = "user-123";
        (auth.api.getSession as any).mockResolvedValue({user: {id: userId}});
        const mockSuggestions = [
            {
                id: "task-1",
                name: "showered",
                source: "user"
            },
            {
                id: "task-2",
                name: "shoveled the garden",
                source: "user"
            }
        ];
        (taskService.suggestTasks as any).mockResolvedValue(mockSuggestions);

        // Action
        const request = new NextRequest('http://localhost:3000/api/tasks/suggestions?q=sho');
        const response = await GET(request);
        const data = await response.json();

        // Assert
        expect(response.status).toBe(201);
        expect(taskService.suggestTasks).toHaveBeenCalledWith(userId, "sho");
        expect(data).toEqual(mockSuggestions);
    });
});