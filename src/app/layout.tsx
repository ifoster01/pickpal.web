import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'
import './globals.css'
import { ThemeProvider } from '@/providers/ThemeProvider';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Pickpockt',
  description: 'Enrich your sports betting.',
}

const RootLayout = (props: PropsWithChildren) => {
  const { children } = props
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout