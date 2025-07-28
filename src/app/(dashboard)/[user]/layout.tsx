import type { Metadata } from "next";
import Header from "../components/Header";
import Nav from "../components/Nav";
import "@/app/global.css";

export const metadata: Metadata = {
    title: "Dashboard | Investo",
    description: "User Dashboard",
};

export default function RootLayout({children}: { children: React.ReactNode; }) {
    return (
        <div className="min-h-screen min-w-screen container bg-light-bg dark:bg-black flex">
            <div>
                <Nav/>
            </div>
            <div className={"container min-h-screen max-w-[100%] bg-light-bg dark:bg-black py-5 px-10"}>
                {children}
            </div>
        </div>
    );
}

