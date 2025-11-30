import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers/providers'
import { AppNavbar } from './_components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chihuahuenos S. A. de C. V. ',
  description: 'Reserva tu boleto de autobús',
}

export default function RootLayout({
  children,
}: Readonly< {
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className='dark'>
      <body className={inter.className}>
        <Providers>
          <AppNavbar />
          <main className='min-h-screen'>
            {children}
          </main>
        </Providers>
        </body>
    </html>
  )
}
