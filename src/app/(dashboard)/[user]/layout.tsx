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
        <div className="w-full min-h-screen  bg-light-bg dark:bg-dark-bg flex">
            <div>
                <Nav/>
            </div>
            <div className={"w-full min-h-screen py-5 px-10"}>
                {children}
            </div>
        </div>
    );
}

