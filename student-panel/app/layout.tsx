import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Najot Ta'lim - Student Panel",
  description: "Najot Ta'lim student panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className="bg-[#f8f9fa] font-sans">
        <React.Suspense fallback={<div className="flex h-screen items-center justify-center"><i className="fa-solid fa-circle-notch fa-spin text-[#c6a27a] text-[24px]"></i></div>}>
          {children}
        </React.Suspense>
      </body>
    </html>
  );
}
