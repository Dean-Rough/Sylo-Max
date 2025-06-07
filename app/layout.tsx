import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sylo-Max | AI-Powered Design Studio Management',
  description: 'Conversational project management for design studios. Streamline your interior design and architecture projects with AI-powered workflows.',
  keywords: ['design studio', 'project management', 'AI', 'interior design', 'architecture'],
  authors: [{ name: 'Dean Newton', email: 'deanlanewton@gmail.com' }],
  openGraph: {
    title: 'Sylo-Max | AI-Powered Design Studio Management',
    description: 'Conversational project management for design studios',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}