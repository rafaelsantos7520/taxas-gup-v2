import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br" suppressHydrationWarning>
        <body className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <Providers>
            <Header />
            <main className="flex-grow flex flex-col justify-center container mx-auto px-4 py-6">
                {children}
            </main>
            <Footer/>
        </Providers>
        </body>
        </html>
    );
}
