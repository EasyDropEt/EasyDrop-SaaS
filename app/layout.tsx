import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { BusinessProvider } from "@/context/BusinessContext";
import { ThemeProvider } from "@/context/ThemeContext";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          <BusinessProvider>
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-grow">
                {children}
              </main>
              <footer className="py-8 border-t border-light-300 dark:border-dark-700">
                <div className="container mx-auto px-4 text-center text-dark-500 dark:text-light-500 text-sm">
                  &copy; {new Date().getFullYear()} EasyDrop. All rights reserved.
                </div>
              </footer>
            </div>
          </BusinessProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
