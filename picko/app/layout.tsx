import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Picko | Campus Food Delivery",
  description: "Skip the queue. Order campus food instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-neutral-50 text-neutral-900 antialiased`}>
        {/* Global UI Components */}
        <Navbar />
        <CartDrawer />
        
        {/* The Toast Provider */}
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '12px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#ea580c', // Tailwind orange-600
                secondary: '#fff',
              },
            },
          }}
        />
        
        {children}
      </body>
    </html>
  );
}