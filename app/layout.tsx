import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "System Design Helper",
  description: "Design scalable systems end-to-end",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


