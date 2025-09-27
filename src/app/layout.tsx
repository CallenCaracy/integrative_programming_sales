import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import PageTransition from "@/components/PageTransition";
import StairTranstition from "@/components/StairEffect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clarence Supermarket",
  description: "Integrative Programming Final Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <div className="mx-auto p-5 px-20">
          <Toaster position="top-right" richColors/>
          <Navbar />
          <StairTranstition />
          <PageTransition>
            {children}
          </PageTransition>
          <Footer/>
      </div>
      </body>
    </html>
  );
}
