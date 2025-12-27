import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

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
        <Navbar />
        <div className="pt-32">
          {children}
        </div>
      </body>
    </html>
  )
}
