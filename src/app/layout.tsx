import type { Metadata } from "next";
import ThemeProvider from "@/components/ThemeProvider";

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
            <script dangerouslySetInnerHTML={{
                __html: `
                (function(){
                    const theme = localStorage.getItem("theme");
                    if(theme){
                        document.bodyElement.classList.add(theme);
                    }else{
                        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                        if(prefersDark){
                            document.bodyElement.classList.add('dark');
                        }
                    }
                })();
                `,
            }} />
        </head>
          <body
            className={`antialiased tracking-tight bg-gradient`}
          >
            <ThemeProvider>
                {children}
            </ThemeProvider>
          </body>
    </html>
  );
}
