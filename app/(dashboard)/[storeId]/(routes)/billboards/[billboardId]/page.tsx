import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
    params,
}: {
    params: { billboardId: string };
}) => {
    const billboard = await prismadb.bilboard.findFirst({
        where: {
            id: params.billboardId,
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
