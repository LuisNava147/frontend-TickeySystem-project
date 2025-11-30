'use client'
import { HeroUIProvider } from '@heroui/react'
import { AuthProvider } from './context/auth-context';

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </HeroUIProvider>
  )
}