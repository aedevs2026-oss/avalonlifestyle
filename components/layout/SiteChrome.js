"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NearStoreWelcome from "@/components/location/NearStoreWelcome";
import SplashScreen from "@/components/layout/SplashScreen";

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return children;
  }

  return (
    <>
      <SplashScreen />
      <Header />
      <main className="flex-1 min-w-0 max-lg:overflow-x-clip">{children}</main>
      <Footer />
      <NearStoreWelcome />
    </>
  );
}
