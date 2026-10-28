import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { WishlistProvider } from "@/context/WishlistContext";

const body = Geist({ variable: "--font-body", subsets: ["latin"] });
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NextShop — Premium gear for your best setup",
    template: "%s · NextShop",
  },
  description:
    "NextShop is a demo e-commerce store: keyboards, mice, audio, displays and desk gear. Built with Next.js, React and Tailwind.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// Applies a saved theme before first paint to avoid a flash.
const themeScript = `try{var t=localStorage.getItem("nextshop:theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${body.variable} ${display.variable} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <UserProvider>
            <WishlistProvider>
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
              <CartDrawer />
            </WishlistProvider>
          </UserProvider>
        </CartProvider>
      </body>
    </html>
  );
}
