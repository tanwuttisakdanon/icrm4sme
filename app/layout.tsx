// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout"; // นำเข้า Layout ที่เราเพิ่งสร้าง

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "icrm4sme - Collaborative CRM for Thai SMEs",
    description: "Manage sales and reduce logistics cost in oil crisis.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {/* ใช้ MainLayout ครอบ children ไว้ */}
                <MainLayout>{children}</MainLayout>
            </body>
        </html>
    );
}