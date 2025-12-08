import type {Metadata} from "next";
import "./globals.css";
import "./styles/animations.scss";
import React from "react";

export const metadata: Metadata = {
    title: "Ta Da! You did it!",
    description: "You’ve done more than you thought possible",
};

export default function RootLayout(
    {
        children,
    }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body
            className={`antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
