import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {NextResponse} from "next/server";
import taskService from "@/domains/tasks/taskService";

export async function POST(request: Request): Promise<Response> {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({
            error: "Unauthorized"
        }, {status: 401})
    }

    const body = await request.json();
    const {name, doneAt} = body;

    if (!name) {

        return NextResponse.json({
            error: "Missing task name"
        }, {status: 400})
    }

    const result = await taskService.logTask({
        userId: session.user.id,
        name,
        doneAt: doneAt ? new Date(doneAt) : undefined
    });

    return NextResponse.json(result, {status: 201});
}