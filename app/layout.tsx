import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { BusinessProvider } from "@/context/BusinessContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EasyDrop - Business Dashboard",
  description: "Manage your deliveries with EasyDrop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <BusinessProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow text-black">
              {children}
            </main>
            <footer className="bg-white border-t py-4">
              <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} EasyDrop. All rights reserved.
              </div>
            </footer>
          </div>
        </BusinessProvider>
      </body>
    </html>
  );
}
