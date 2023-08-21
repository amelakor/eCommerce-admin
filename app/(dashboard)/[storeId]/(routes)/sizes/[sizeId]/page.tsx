import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

const SizePage = async ({
    params,
}: {
    params: { sizeId: string; storeId: string };
}) => {
    let size;

    if (params.sizeId === "new") {
        size = null;
    } else {
        size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            },
        });
    }

    return (
        <div className="flex-col">
            <div className="flex-1 spave-y-4 p-8">
                <SizeForm initialData={size} />
            </div>
        </div>
    );
};

export default SizePage;
