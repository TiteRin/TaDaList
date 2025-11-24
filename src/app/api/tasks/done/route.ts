import {auth} from "@/lib/auth";

export async function POST(request: Request): Promise<Response> {

    const session = await auth.api.getSession(request);

    return new Response(
        JSON.stringify({error: "Unauthorized"}),
        {status: 401}
    );
}