import {LoggedTask, TaskSuggestion} from "@/domains/tasks/taskService";

export interface LogTaskPayload {
    name: string;
    doneAt?: Date;
}

export async function logTask(payload: LogTaskPayload): Promise<LoggedTask> {

    const result = await fetch("/api/tasks/done", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    if (!result.ok) {
        throw new Error("Failed to log task");
    }

    return result.json();
}

export async function suggestTasks(query: string = ""): Promise<TaskSuggestion[]> {
    const params = new URLSearchParams({q: query});
    const results = await fetch(`/api/tasks/suggestions?${params}`);

    if (!results.ok) {
        throw new Error("Failed to fetch suggestions");
    }

    return results.json();
}
