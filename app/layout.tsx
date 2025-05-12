import './globals.css'
import type { Metadata } from 'next'
import { Inter as FontSans } from "next/font/google"
import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from '@clerk/localizations'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'

const inter = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'ApexMed',
  description: 'Plataforma de educação em saúde',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-BR" className={`${inter.className} dark`} suppressHydrationWarning>
        <body className="antialiased bg-background">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              theme="dark"
              position="top-right"
              richColors
              closeButton
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}