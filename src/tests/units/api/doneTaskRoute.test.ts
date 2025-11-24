import {beforeEach, describe, expect, it, vi} from "vitest";
import {auth} from "@/lib/auth";
import {POST} from "@/app/api/tasks/done/route";


vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn(),
        }
    }
}));

vi.mock('@/domains/tasks/taskService', () => () => ({
    taskService: {
        logTask: vi.fn(),
    }
}));

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
})