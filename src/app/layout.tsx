'use client'

import { ReactToastifyProvider } from "@/context/ReactToastifyProvider";
import "./globals.css";
import { ReactQueryProvider } from "@/context/ReactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="mdl-js">
      <body>
        <ReactToastifyProvider>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </ReactToastifyProvider>
      </body>
    </html>
  );
}
