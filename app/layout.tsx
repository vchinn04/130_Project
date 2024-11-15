import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ReactSVG } from "react";

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
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  welcome,
  home,
}: Readonly<{
  children: React.ReactNode;
  welcome: React.ReactNode;
  home: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SignedOut>
            {/* <SignInButton /> */}
            {welcome}
          </SignedOut>
          <SignedIn>
            {/* <UserButton /> */}
            {home}
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
