import {PrismaClient, Task} from "@/generated/prisma/client";
import {DEFAULT_TASKS} from "@/config/defaultTasks";

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

        const tasks = await prisma.task.findMany({
            where: {
                name: {
                    startsWith: sanitizedSearchTerm,
                    mode: "insensitive"
                },
                userId
            },
            take: limit
        });

        if (tasks.length > 0) {
            return tasks.map(task => ({id: task.id, name: task.name, source: "user"}));
        }

        return DEFAULT_TASKS.filter((task) => {
            return task.startsWith(sanitizedSearchTerm);
        }).map(task => ({id: null, name: task, source: "global"}));

    }

    return {
        logTask,
        suggestTasks
    }
}