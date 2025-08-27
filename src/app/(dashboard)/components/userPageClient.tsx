"use client";
import Nav from "../components/Nav";
import NavMobile from "../components/NavMobile";


export default function UserPageClient({children}: { children: React.ReactNode; }) {

    return (
        <div className="w-full min-h-screen  bg-light-bg dark:bg-dark-bg flex">
            <div className={"hidden lg:block"}>
                <Nav/>
            </div>
            <div className={"lg:hidden"}>
                <NavMobile/>
            </div>
            <div className={"w-full min-h-screen lg:py-5 lg:px-5"}>
                {children}
            </div>
        </div>
    );
}
