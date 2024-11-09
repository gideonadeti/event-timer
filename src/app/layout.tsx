import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

import "./globals.css";
import { H1, H3 } from "./components/custom-tags";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Event Timer",
  description:
    "A web app for setting countdowns to future events and count-ups from past events.",
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
        <ClerkProvider>
          <SignedIn>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </SignedIn>
          <SignedOut>
            <div className="flex flex-col md:flex-row items-center justify-around gap-8 h-screen overflow-y-auto p-8">
              <div className="flex flex-col text-center lg:text-left">
                <H1>Welcome to Event Timer</H1>
                <H3>
                  A web app for setting countdowns to future events and
                  count-ups from past events
                </H3>
              </div>
              <div className="flex items-center justify-center">
                <SignIn />
              </div>
            </div>
          </SignedOut>
        </ClerkProvider>
      </body>
    </html>
  );
}
