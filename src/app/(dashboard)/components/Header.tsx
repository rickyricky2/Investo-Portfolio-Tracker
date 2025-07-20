import Link from "next/link";


export default function Header(){
    return(
        <header className={"min-w-screen max-h-15 bg-[#A882DD] rounded-b-sm sm:sticky top-0 tracking-tight z-20 flex justify-between items-center px-5"}>
            <div>
                <Link href={"/"}>
                    <div className={"text-6xl inline-block text-white font-semibold pb-5 py-2"}>
                        investo
                    </div>
                </Link>
            </div>
            <div>
                <p>ACCOUNT</p>
            </div>
        </header>
    );
}