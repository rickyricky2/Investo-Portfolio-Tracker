import Link from "next/link";


export default function PublicHeader(){
    return(
        <header className={"min-w-screen max-h-20 bg-[#A882DD] rounded-b-sm sm:sticky tracking-tight z-20 flex justify-center"}>
            <Link href={"/"}>
                <div className={"text-6xl inline-block text-white font-semibold pb-5 py-2"}>
                    investo
                </div>
            </Link>
        </header>
    );
}