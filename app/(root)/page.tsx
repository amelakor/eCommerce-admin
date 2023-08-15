import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function SetupPage() {
    return (
        <div>
            <p>Protected route</p>
            <UserButton afterSignOutUrl="/" />
        </div>
    );
}
