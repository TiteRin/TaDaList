import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import taskService from "@/domains/tasks/taskService";

export async function GET(request: NextRequest): Promise<Response> {

    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        return NextResponse.json({
            error: "Unauthorized"
        }, {status: 401})
    }

    const query = request.nextUrl.searchParams.get('q');

    const suggestions = await taskService.suggestTasks(session.user.id, query || "");

    return NextResponse.json(suggestions, {status: 201});
}