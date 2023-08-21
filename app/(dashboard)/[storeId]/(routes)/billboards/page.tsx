import prismadb from "@/lib/prismadb";
import BilboardClient from "./components/BilboardClient";
const BilboardsPage = async ({ params }: { params: { storeId: string } }) => {
    const billboards = await prismadb.bilboard.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BilboardClient data={billboards} />
            </div>
        </div>
    );
};

export default BilboardsPage;
