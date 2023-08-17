import BilboardClient from "./components/BilboardClient";
const BilboardsPage = () => {
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BilboardClient />
            </div>
        </div>
    );
};

export default BilboardsPage;
