import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/Navbar";

export const metadata: Metadata = {
  title: "WaitLess - Mumbai Clinics",
  description: "Browse real clinics, compare live queue lengths, and grab a digital token.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F6F5F0]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
