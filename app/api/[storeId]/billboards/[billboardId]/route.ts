import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { billboardId: string } }
) {
    try {
        if (!params.billboardId) {
            return new NextResponse("Billboard id is requerid.", {
                status: 400,
            });
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            },
        });

        return new NextResponse(JSON.stringify(billboard), {
            status: 200,
        });
    } catch (e) {
        console.log(e, "[billboards get]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { storeId: string; billboardId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthaticated", { status: 401 });
        }

        const body = await request.json();

        const { label, imageUrl } = body;

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("Image url is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("No store provided.", { status: 400 });
        }

        if (!params.billboardId) {
            return new NextResponse("No billboard provided.", { status: 400 });
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

        const billboard = await prismadb.billboard.update({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl,
            },
        });

        return new NextResponse(JSON.stringify(billboard), {
            status: 201,
        });
    } catch (e) {
        console.log(e, "[billboards patch]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { storeId: string; billboardId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthaticated", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("No store provided.", { status: 400 });
        }

        if (!params.billboardId) {
            return new NextResponse("No billboard provided.", { status: 400 });
        }

        const billboard = await prismadb.billboard.delete({
            where: {
                id: params.billboardId,
            },
        });

        return new NextResponse(JSON.stringify(billboard), {
            status: 201,
        });
    } catch (e) {
        console.log(e, "[billboards delete]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
