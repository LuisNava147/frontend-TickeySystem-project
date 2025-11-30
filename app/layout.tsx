import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppNavbar } from "./_components/Navbar";

import { Toaster } from "sonner"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chihuahueños S.A. de C.V.",
  description: "Reserva de boletos de autobús",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className='dark'>
      <body className={inter.className}>
        <Providers>
          <AppNavbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster position="top-center" richColors theme="dark" />
        </Providers>
      </body>
    </html>
  );
}