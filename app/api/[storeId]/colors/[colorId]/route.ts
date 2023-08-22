import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { colorId: string } }
) {
    try {
        if (!params.colorId) {
            return new NextResponse("Size id is requerid.", {
                status: 400,
            });
        }

        const color = await prismadb.billboard.findUnique({
            where: {
                id: params.colorId,
            },
        });

        return new NextResponse(JSON.stringify(color), {
            status: 200,
        });
    } catch (e) {
        console.log(e, "[color get]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { storeId: string; colorId: string } }
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

        if (!params.colorId) {
            return new NextResponse("No color provided.", { status: 400 });
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

        const color = await prismadb.color.update({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value,
            },
        });

        return new NextResponse(JSON.stringify(color), {
            status: 201,
        });
    } catch (e) {
        console.log(e, "[color patch]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { storeId: string; colorId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthaticated", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("No store provided.", { status: 400 });
        }

        if (!params.colorId) {
            return new NextResponse("No Size provided.", { status: 400 });
        }

        const color = await prismadb.color.delete({
            where: {
                id: params.colorId,
            },
        });

        return new NextResponse(JSON.stringify(color), {
            status: 201,
        });
    } catch (e) {
        console.log(e, "[color delete]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
