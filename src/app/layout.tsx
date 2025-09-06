import type { Metadata } from "next";
import ThemeProvider from "@/components/ThemeProvider";
import {NotificationProvider} from "@/app/(dashboard)/components/changeNotification";
import {AuthProvider} from "@/app/(dashboard)/components/AuthContext";
import SetTheme from "@/components/SetTheme";

export const metadata: Metadata = {
  title: "Investo",
  description: "Investment tracking site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
        <head>
            <link rel="icon" href="/favicon.ico"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        </head>
        <body
            className={`antialiased tracking-tight bg-gradient`}
            >
            <SetTheme/>
            <AuthProvider>
                <NotificationProvider>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </NotificationProvider>
            </AuthProvider>
        </body>
    </html>
  );
}
