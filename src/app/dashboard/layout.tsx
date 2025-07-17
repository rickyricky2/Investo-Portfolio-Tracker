import type { Metadata } from "next";
import { redirect } from "next/navigation";
import getUserFromToken from "@/functions/getUserFromToken";

export const metadata: Metadata = {
    title: "Dashboard | investo",
    description: "Dashboard",
};

export default function RootLayout({children}: { children: React.ReactNode; }) {
    const user = getUserFromToken();

    if (!user) {
        redirect("/login");
    }

    return (
        <div>
            {children}
        </div>
    );
}

