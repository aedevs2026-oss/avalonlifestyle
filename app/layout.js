import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import "./mobile-tablet.css";
import SiteChrome from "@/components/layout/SiteChrome";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://avalonmattress.in"),
  title: {
    default: "Avalon Premium Mattress | Better Sleep. A Brighter Tomorrow.",
    template: "%s | Avalon Premium Mattress",
  },
  description:
    "Thoughtfully designed mattresses and furniture for deeper sleep, better health and brighter days.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-avalon-black">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
