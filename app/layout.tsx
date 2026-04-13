import type { Metadata } from "next";
// INI DIA TERSANGKANYA! Baris ini yang manggil Tailwind lu
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Pohon Silsilah Keluarga",
  description: "Aplikasi manajemen silsilah keluarga",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col antialiased bg-slate-50"
        suppressHydrationWarning
      >
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
