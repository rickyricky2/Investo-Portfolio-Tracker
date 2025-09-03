
import Link from "next/link";
import SwitchThemeButton from "@/app/(dashboard)/components/SwitchThemeButton";

export default function PublicHeader(){

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    return(
        <header className={`transition-[max-height] max-w-screen max-h-[70px] pb-1 sm:pb-1 main-gradient shadow-md tracking-tight z-20 flex gap-2 tiny:gap-0 items-center justify-center px-2 md:px-5 lg:px-10 py-1`}>
            <div className={""}>
                <Link href={baseURL}>
                    <div className={"text-5xl sm:text-6xl text-center inline-block text-light-bg dark:text-dark-bg font-semibold"}>
                        investo
                    </div>
                </Link>
            </div>
            <div className={`transition-all fixed bottom-10 right-2 z-[999]`}>
                <SwitchThemeButton type={"horizontal"}/>
            </div>
        </header>
    );
}