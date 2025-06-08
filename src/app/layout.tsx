// ============================================================================
// src/app/layout.tsx - Root layout (FIXED)
// ============================================================================

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/providers/store-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "École Ennour - Admin Dashboard",
    description: "Modern admin dashboard with RTL support for École Ennour",
};

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    // Get locale from headers (set by middleware)
    const headersList = await headers()
    const locale = headersList.get('x-locale') || 'en'

    // Get messages for the current locale
    const messages = await getMessages();

    // Get direction for RTL support
    const direction = locale === 'ar' ? 'rtl' : 'ltr';

    return (
        <html
            lang={locale}
            dir={direction}
            suppressHydrationWarning
        >
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            data-locale={locale}
            data-direction={direction}
        >
        <NextIntlClientProvider locale={locale} messages={messages}>
            <StoreProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster
                        position="top-center"
                        closeButton
                        richColors
                    />
                </ThemeProvider>
            </StoreProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}