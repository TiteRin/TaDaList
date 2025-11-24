import {NextRequest, NextResponse} from "next/server";
import {headers} from "next/headers";

export interface LogTaskPayload {
    name: string;
    doneAt?: Date;
}

export async function logTask(payload: LogTaskPayload): Promise<Response> {

    const result = await fetch("/api/tasks/done", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    if (!result.ok) {
        throw new Error("Failed to log task");
    }

    return result;
}

export function suggestTasks(): Promise<NextResponse> {
}
