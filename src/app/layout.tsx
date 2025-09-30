'use client'

import { ReactToastifyProvider } from "@/context/ReactToastifyProvider";
import "./globals.css";
import { ReactQueryProvider } from "@/context/ReactQueryProvider";
import HeaderComponent from "@/common/header/HeaderComponent";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const hideHeaderPaths = ["/login", "/register", '/register/customer-register', '/register/store-register', '/forgot-password', '/store', '/store/products', '/store/orders', '/store/staff', '/store/info', '/admin/dashboard', '/admin/roles', '/admin/user-management','/admin/appointments', '/admin/store-management', '/store/my-store/services', '/admin/orders-and-services', '/admin/community-management'];
  const showHeader = !hideHeaderPaths.includes(pathname);
  return (
    <html lang="en" className="mdl-js">
      <body>
        <ReactToastifyProvider>
          <ReactQueryProvider>
            {showHeader && <HeaderComponent />}
            {children}
          </ReactQueryProvider>
        </ReactToastifyProvider>
      </body>
    </html>
  );
}
