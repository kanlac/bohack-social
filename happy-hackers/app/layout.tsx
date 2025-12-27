import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hackathon Social - Onboarding',
  description: 'Find your hackathon tribe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-manrope antialiased">
        {children}
      </body>
    </html>
  )
}
