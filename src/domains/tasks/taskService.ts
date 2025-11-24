import {PrismaClient, Task} from "@/generated/prisma/client";
import {DEFAULT_TASKS} from "@/config/defaultTasks";
import {TaskWhereInput} from "@/generated/prisma/models/Task";
import prisma from "@/lib/prisma";

export interface TaskService {
    logTask: (input: LogTaskInput) => Promise<LoggedTask>,
    suggestTasks: (userId: string, searchTerm: string, limit?: number) => Promise<TaskSuggestion[]>
}

export interface LogTaskInput {
    userId: string,
    name: string,
    doneAt?: Date
}

export interface LoggedTask {
    taskId: string,
    taskName: string,
    doneTaskId: string,
    doneAt: Date
}

export interface TaskSuggestion {
    id: string | null,
    name: string,
    source: "user" | "global"
}

export function createTaskService(prisma: PrismaClient): TaskService {

    function sanitizeInput(input: LogTaskInput): LogTaskInput {
        return {
            userId: input.userId,
            name: input.name.trim(),
        }
    }

    async function logTask(input: LogTaskInput): Promise<LoggedTask> {

        const sanitizedInput = sanitizeInput(input);

        let task: Task | null;

        // Chercher si la tâche existe déjà
        task = await prisma.task.findFirst({
            where: {
                userId: sanitizedInput.userId,
                name: sanitizedInput.name
            }
        });

        if (!task) {
            task = await prisma.task.create({data: {userId: sanitizedInput.userId, name: sanitizedInput.name}});
        }

        // La tâche n’existe pas, on créé la tâche
        const doneTask = await prisma.doneTask.create({
            data: {
                taskId: task.id,
                userId: sanitizedInput.userId,
                doneAt: sanitizedInput.doneAt || new Date()
            }
        });

        return {
            taskId: task.id,
            taskName: task.name,
            doneTaskId: doneTask.id,
            doneAt: doneTask.doneAt
        }
    }

    async function suggestTasks(userId: string, searchTerm: string, limit: number = 5): Promise<TaskSuggestion[]> {
        const sanitizedSearchTerm = searchTerm.trim();

        const where: TaskWhereInput = {userId};

        if (sanitizedSearchTerm) {
            where.name = {
                startsWith: sanitizedSearchTerm,
                mode: "insensitive"
            };
        }

        const tasks = await prisma.task.findMany({
            where,
            orderBy: {
                updatedAt: "desc"
            },
            take: limit
        });

        const suggestions = tasks.map((task: Task): TaskSuggestion => ({
            id: task.id,
            name: task.name,
            source: "user"
        }));

        if (suggestions.length === limit) {
            return suggestions;
        }

        return [
            ...suggestions,
            ...DEFAULT_TASKS
                .filter((task) => (
                    task.startsWith(sanitizedSearchTerm)
                )).map((task: string): TaskSuggestion => (
                    {id: null, name: task, source: "global"}
                ))
        ].slice(0, limit);

    }

    return {
        logTask,
        suggestTasks
    }
}

const taskService = createTaskService(prisma);
export default taskService;