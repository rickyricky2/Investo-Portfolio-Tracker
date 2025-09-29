import type { Metadata } from "next";
import ThemeProvider from "@/components/ThemeProvider";
import {NotificationProvider} from "@/app/(dashboard)/components/changeNotification";
import {AuthProvider} from "@/app/(dashboard)/components/AuthContext";

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
    <html lang="en" translate={"no"}>
    <head>
        <link rel="icon" href="/favicon.ico"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <meta name={"google"} content={"notranslate"}/>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="description" content="Take control of your investments with Investo. Easily add assets, track their performance, and visualize your portfolio with powerful interactive charts."/>
        <meta name="keywords"
              content="investo,tracker,investing,investing tracker, wallet,wallet tracking,wallet tracker,portfolio,portfolio tracker,invest"/>
        {/*social media meta*/}
        <meta property="og:title" content="Investo – Your Investment Tracker"/>
        <meta property="og:description"
              content="Take control of your investments with Investo. Easily add assets, track their performance, and visualize your portfolio with powerful interactive charts."/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://investo-lit9.vercel.app"/>
        {/*<meta property="og:image" content="https://investo-lit9.vercel.app/og-image.png"/>*/}
        {/*    twitter meta*/}
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="Investo – Your Investment Tracker"/>
        <meta name="twitter:description" content="Take control of your investments with Investo. Easily add assets, track their performance, and visualize your portfolio with powerful interactive charts."/>
        {/*<meta name="twitter:image" content="https://investo-lit9.vercel.app/twitter-image.png"/>*/}
    </head>
    <body
        className={`antialiased tracking-tight bg-gradient`}
            >
            <ThemeProvider>
                <AuthProvider>
                    <NotificationProvider>
                            {children}
                    </NotificationProvider>
                </AuthProvider>
            </ThemeProvider>
        </body>
    </html>
  );
}
