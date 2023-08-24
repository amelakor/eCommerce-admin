import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        if (!params.categoryId) {
            return new NextResponse("Category id is requerid.", {
                status: 400,
            });
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            },
            include: {
                billboard: true,
            },
        });

        return new NextResponse(JSON.stringify(category), {
            status: 200,
        });
    } catch (e) {
        console.log(e, "[category get]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { storeId: string; categoryId: string } }
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
            return new NextResponse("Billboard is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("No store provided.", { status: 400 });
        }

        if (!params.categoryId) {
            return new NextResponse("No category provided.", { status: 400 });
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

        const category = await prismadb.category.update({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId,
            },
        });

        return new NextResponse(JSON.stringify(category), {
            status: 201,
        });
    } catch (e) {
        console.log(e, "[category patch]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { storeId: string; categoryId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthaticated", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("No store provided.", { status: 400 });
        }

        if (!params.categoryId) {
            return new NextResponse("No category provided.", { status: 400 });
        }

        const category = await prismadb.category.delete({
            where: {
                id: params.categoryId,
            },
        });

        return new NextResponse(JSON.stringify(category), {
            status: 201,
        });
    } catch (e) {
        console.log(e, "[category delete]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
