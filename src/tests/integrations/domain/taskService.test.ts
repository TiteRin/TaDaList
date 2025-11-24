import {beforeEach, describe, expect, it, vi} from "vitest";
import {DeepMockProxy, mockDeep} from "vitest-mock-extended";
import {PrismaClient} from "@/generated/prisma/client";
import {createTaskService, TaskService} from "@/domains/tasks/taskService";

describe("TaskService", function () {

    let prismaMock: DeepMockProxy<PrismaClient>;
    let service: TaskService;

    const userId = "user-1";
    const now = new Date("2025-01-01T00:00:00.000Z");

    beforeEach(function () {

        prismaMock = mockDeep<PrismaClient>();
        service = createTaskService(prismaMock);

        vi.useFakeTimers().setSystemTime(now);
    })

    describe("logTask", async function () {

        it("créé une nouvelle tâche pour l’utilisateur, si elle n’existe pas", async function () {
            prismaMock.task.findFirst.mockResolvedValue(null);

            const createdTask = {
                id: "task-1",
                name: "showered",
                userId,
                createdAt: now,
                updatedAt: now
            }

            prismaMock.task.create.mockResolvedValue(createdTask);
            prismaMock.doneTask.create.mockResolvedValue({
                id: "done-1",
                taskId: "task-1",
                userId,
                doneAt: now
            });

            // Action
            const result = await service.logTask({userId, name: "showered", doneAt: now});

            // Assertions
            expect(prismaMock.task.findFirst).toHaveBeenCalledWith({where: {userId, name: "showered"}});
            expect(prismaMock.task.create).toHaveBeenCalledWith({data: {userId, name: "showered"}});
            expect(prismaMock.doneTask.create).toHaveBeenCalledWith({data: {taskId: "task-1", userId, doneAt: now}});

            expect(result).toEqual({
                taskId: "task-1",
                taskName: "showered",
                doneTaskId: "done-1",
                doneAt: now
            });
        });


        it('réutilise la tâche lorsque celle-ci existe déjà pour cet utilisateur', async function () {
            // Setup
            const existingTask = {
                id: 'existing-task-id',
                name: 'ran errands',
                userId,
                createdAt: now,
                updatedAt: now
            };

            prismaMock.task.findFirst.mockResolvedValue(existingTask);

            // Approach
            prismaMock.doneTask.create.mockResolvedValue({
                id: 'done-1',
                taskId: existingTask.id,
                userId,
                doneAt: now
            });

            // Action
            const result = await service.logTask({userId, name: 'ran errands', doneAt: now});

            // Assert
            expect(prismaMock.task.create).not.toHaveBeenCalled();
            expect(prismaMock.doneTask.create).toHaveBeenCalledWith({
                data: {taskId: existingTask.id, userId, doneAt: now}
            });

            expect(result.taskId).toBe(existingTask.id);
        });


        it("normalize le nom de la tâche avant d’effectuer les actions en base de données", async () => {

            // Approach
            prismaMock.task.findFirst.mockResolvedValue(null);
            prismaMock.task.create.mockResolvedValue({
                id: "task-1",
                name: "showered",
                userId,
                createdAt: now,
                updatedAt: now
            });
            prismaMock.doneTask.create.mockResolvedValue({id: "done-1", taskId: "task-1", userId, doneAt: now});

            // Action
            const result = await service.logTask({userId, name: "  showered  ", doneAt: now});

            // Assert
            expect(prismaMock.task.findFirst).toHaveBeenCalledWith({where: {userId, name: "showered"}});
            expect(prismaMock.task.create).toHaveBeenCalledWith({data: {userId, name: "showered"}});
            expect(result.taskName).toBe("showered");
        });
    });

    describe("suggestTasks", () => {

        it("retourne les tâches utilisateurs qui matchent la recherche", async () => {

            // Approach
            prismaMock.task.findMany.mockResolvedValue([
                {id: "task-1", name: "ate something", userId, createdAt: now, updatedAt: now},
                {id: "task-2", name: "ate something healthy", userId, createdAt: now, updatedAt: now},
                {id: "task-3", name: "ate outside", userId, createdAt: now, updatedAt: now},
                {id: "task-4", name: "ate vegetables", userId, createdAt: now, updatedAt: now},
                {id: "task-5", name: "ate with my friends", userId, createdAt: now, updatedAt: now},
            ]);

            // Action
            const suggestions = await service.suggestTasks(userId, "ate", 5);

            // Assert
            expect(prismaMock.task.findMany).toHaveBeenCalledWith({
                where: {
                    userId,
                    name: {startsWith: "ate", mode: "insensitive"}
                },
                take: 5
            });

            expect(suggestions).toHaveLength(5);
            expect(suggestions).toContainEqual({id: "task-1", name: "ate something", source: "user"});
            expect(suggestions).toContainEqual({id: "task-2", name: "ate something healthy", source: "user"});
            expect(suggestions).toContainEqual({id: "task-3", name: "ate outside", source: "user"});
            expect(suggestions).toContainEqual({id: "task-4", name: "ate vegetables", source: "user"});
            expect(suggestions).toContainEqual({id: "task-5", name: "ate with my friends", source: "user"});
        });

        it("complète avec les tâches par défaut si besoin", async () => {
            // Approach
            prismaMock.task.findMany.mockResolvedValue([]);

            // Action
            const suggestions = await service.suggestTasks(userId, "played", 5);
            const defaultTask = suggestions.find(task => task.name.includes("played"));

            // Assert
            expect(suggestions.length).toBeGreaterThan(0);
            expect(defaultTask).toBeDefined();

            expect(defaultTask).toEqual({
                id: null,
                name: defaultTask!.name,
                source: "global"
            })
        });

        it('évite les doublons entre les tâches utilisateurs et les tâches globales', async () => {

            // Approach
            prismaMock.task.findMany.mockResolvedValue([
                {id: "task-1", name: "played guitar", userId, createdAt: now, updatedAt: now},
            ]);

            // Action
            const suggestions = await service.suggestTasks(userId, "played", 5);
            const playedSuggestions = suggestions.filter(task => task.name.includes("played"));

            // Assert
            expect(playedSuggestions).toHaveLength(5);
            expect(playedSuggestions[0].source).toBe("user");
        });
    });
})