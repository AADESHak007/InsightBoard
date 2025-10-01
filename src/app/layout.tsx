import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NYC Insights Dashboard",
  description: "Track and analyze key NYC development indicators",
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
