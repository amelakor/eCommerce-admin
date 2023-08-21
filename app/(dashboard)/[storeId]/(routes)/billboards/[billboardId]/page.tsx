import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({ params }: { params: { storeId: string } }) => {
    const billboard = await prismadb.bilboard.findFirst({
        where: {
            storeId: params.storeId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 spave-y-4 p-8">
                <BillboardForm initialData={billboard} />
            </div>
        </div>
    );
};

export default BillboardPage;
