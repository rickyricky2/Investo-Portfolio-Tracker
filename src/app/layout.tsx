import type { Metadata } from "next";

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
      <body
        className={`antialiased tracking-tight`}
      >
        {children}
      </body>
    </html>
  );
}
