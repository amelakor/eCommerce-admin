import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
    params,
}: {
    params: { categoryId: string; storeId: string };
}) => {
    let category;

    if (params.categoryId === "new") {
        category = null;
    } else {
        category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            },
        });
    }

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 spave-y-4 p-8">
                <CategoryForm initialData={category} billboards={billboards} />
            </div>
        </div>
    );
};

export default CategoryPage;
