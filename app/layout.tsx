import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { BusinessProvider } from "@/context/BusinessContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { MapProvider } from "@/providers/map-provider";
import { Toaster } from "react-hot-toast";
import Footer from '@/components/layout/Footer';

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
                <MapProvider>
                  <main className="flex-grow">
                    {children}
                  </main>
                </MapProvider>
              <Footer />
              <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            </div>
          </BusinessProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}