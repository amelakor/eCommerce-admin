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

        const {
            name,
            price,
            isFeatured,
            isArchived,
            sizeId,
            categoryId,
            colorId,
            images,
        } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("No store provided.", { status: 400 });
        }

        if (!sizeId) {
            return new NextResponse("Size is required", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("Category is required", { status: 400 });
        }

        const store = await prismadb.store.findUnique({
            where: {
                id: params.storeId,
            },
        });

        if (!store) {
            return new NextResponse("Unathorized", { status: 403 });
        }

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                sizeId,
                categoryId,
                colorId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ],
                    },
                },
                storeId: params.storeId,
            },
        });

        return new NextResponse(JSON.stringify(product), {
            status: 201,
        });
    } catch (e) {
        console.log(e, "[product post]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        return new NextResponse(JSON.stringify(products), {
            status: 201,
        });
    } catch (e) {
        console.log(e, "[products get]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
