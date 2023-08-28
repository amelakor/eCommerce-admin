import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { productId: string } }
) {
    try {
        if (!params.productId) {
            return new NextResponse("product id is requerid.", {
                status: 400,
            });
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            },
        });

        return new NextResponse(JSON.stringify(product), {
            status: 200,
        });
    } catch (e) {
        console.log(e, "[products get]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { storeId: string; productId: string } }
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

        const product = await prismadb.product.update({
            where: {
                id: params.productId,
            },
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
        console.log(e, "[products patch]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { storeId: string; productId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthaticated", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("No store provided.", { status: 400 });
        }

        if (!params.productId) {
            return new NextResponse("No product provided.", { status: 400 });
        }

        const product = await prismadb.product.delete({
            where: {
                id: params.productId,
            },
        });

        return new NextResponse(JSON.stringify(product), {
            status: 201,
        });
    } catch (e) {
        console.log(e, "[products delete]");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
