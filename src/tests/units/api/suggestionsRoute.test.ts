import {beforeEach, describe, expect, it, vi} from "vitest"
import {auth} from "@/lib/auth";
import { GET } from '@/app/api/tasks/suggestions/route';

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
        const request = new Request('http://localhost:3000/api/tasks/suggestions?q=sho');

        // Action
        const response = await GET(request);
        const data = await response.json();

        // Assert
        expect(response.status).toBe(401);
        expect(data.error).toBe("Unauthorized");
    });
});