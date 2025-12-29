import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Medusa Store',
  description: 'Medusa v2.12.3 Storefront',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

