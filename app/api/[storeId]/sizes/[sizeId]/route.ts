import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { sizeId: string } }
) {
    try {
        if (!params.sizeId) {
            return new NextResponse("Size id is requerid.", {
                status: 400,
            });
        }

        const size = await prismadb.billboard.findUnique({
            where: {
                id: params.sizeId,
            },
        });

        return new NextResponse(JSON.stringify(size), {
            status: 200,
        });
    } catch (e) {
        console.log(e, "[size get]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { storeId: string; sizeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthaticated", { status: 401 });
        }

        const body = await request.json();

        const { name, value } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("No store provided.", { status: 400 });
        }

        if (!params.sizeId) {
            return new NextResponse("No size provided.", { status: 400 });
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

        const size = await prismadb.size.update({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value,
            },
        });

        return new NextResponse(JSON.stringify(size), {
            status: 201,
        });
    } catch (e) {
        console.log(e, "[size patch]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { storeId: string; sizeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthaticated", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("No store provided.", { status: 400 });
        }

        if (!params.sizeId) {
            return new NextResponse("No Size provided.", { status: 400 });
        }

        const size = await prismadb.size.delete({
            where: {
                id: params.sizeId,
            },
        });

        return new NextResponse(JSON.stringify(size), {
            status: 201,
        });
    } catch (e) {
        console.log(e, "[size delete]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
