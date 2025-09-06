import Link from "next/link";
import React from "react";

type MenuItemProps = {
    icon: React.ReactNode;
    label: string;
    url:string;
    open: boolean;
};

const MenuItem = React.memo(({ icon, label,url, open }: MenuItemProps) => {
    return (
        <li className={`px-2 py-2 my-2 hover:bg-[hsl(266,40%,85%)] hover:scale-103 dark:hover:bg-[hsl(259,17%,12%)] rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group  ${open ? "":"justify-between"}`}>
            <Link href={`/${url}`} className={"flex items-center gap-2"}>
                <div>{icon}</div>
                <p className={`${!open && 'w-0 translate-x-24 opacity-0'} duration-500 overflow-hidden`}>{label}</p>
                <p className={`${open && 'hidden'}  absolute left-32 shadow-xl rounded-xl z-[999]
                   w-0 p-0 text-light-text-tertiary dark:text-dark-text-tertiary bg-[hsl(266,40%,94%)] dark:bg-[hsl(259,17%,25%)] font-medium duration-100 overflow-hidden group-hover:w-fit group-hover:p-2 group-hover:left-16
                `}>{label}
                </p>
            </Link>
        </li>
    );
});

MenuItem.displayName = "MenuItem";

export default MenuItem;