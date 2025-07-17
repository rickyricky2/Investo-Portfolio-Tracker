import type { Metadata } from "next";
import {redirect}  from "next/navigation";
import getUserFromToken from "@/functions/getUserFromToken";

export const metadata: Metadata = {
  title: "Investo",
  description: "Investment tracking site",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const user = await getUserFromToken();

    // if(user){
    //     redirect("/dashboard");
    // }


  return (
    <html lang="en">
      <body
        className={`antialiased tracking-tight`}
      >
        {children}
      </body>
    </html>
  );
}
