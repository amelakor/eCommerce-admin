import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();

        const { name } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        const store = await prismadb.store.create({
            data: {
                name,
                userId,
            },
        });

        return new NextResponse(JSON.stringify(store), {
            status: 201,
        });
    } catch (e) {
        console.log(e, "[stores post]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
