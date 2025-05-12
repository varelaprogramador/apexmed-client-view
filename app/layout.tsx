import type { Metadata } from 'next'
import {
  ClerkProvider,
  // SignInButton,
  // SignUpButton,
  // SignedIn,
  // SignedOut,
  // UserButton,
} from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'ApexMed',
  description: 'Plataforma de cursos médicos',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider localization={{ locale: "pt-BR" }}>
      <html lang="pt-BR" className={`${inter.className} dark`} suppressHydrationWarning>
        <body className="antialiased bg-background">
          {/* <header className="flex justify-end items-center p-4 gap-4 h-16">
            <UserButton />

          </header> */}
          <ThemeProvider
            attribute="class"
            defaultTheme="netflix-blue"
            forcedTheme="netflix-blue"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}