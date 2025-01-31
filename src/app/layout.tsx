import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import { AppProvider } from "@/contexts/AppContext";
import React from "react";
// import Loader from "@/components/common/Loader";
import ClientWrapper from "@/components/ClientWrapper";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // const pathname = usePathname();


  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <ClientWrapper>
            <AppProvider>{children}</AppProvider>
          </ClientWrapper>
        </div>

      </body>
    </html>
  );
}
