import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthaticated", { status: 401 });
        }

        const body = await request.json();

        const { name, billboardId } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("Billboard is required", {
                status: 400,
            });
        }

        if (!params.storeId) {
            return new NextResponse("No store provided.", { status: 400 });
        }

        const store = await prismadb.store.findUnique({
            where: {
                id: params.storeId,
                userId,
            },
        });

        if (!store) {
            return new NextResponse("Unathorized", { status: 403 });
        }

        const billboard = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId,
            },
        });

        return new NextResponse(JSON.stringify(billboard), {
            status: 201,
        });
    } catch (e) {
        console.log(e, "[categories post]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        return new NextResponse(JSON.stringify(categories), {
            status: 201,
        });
    } catch (e) {
        console.log(e, "[categories get]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
