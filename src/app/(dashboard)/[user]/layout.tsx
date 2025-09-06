
import "@/app/global.css";
import UserPageClient from "../components/userPageClient";


export default function RootLayout({children}: { children: React.ReactNode  }) {
    return (
        <UserPageClient >
            {children}
        </UserPageClient>
    );
}

