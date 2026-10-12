import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Jua, Gowun_Dodum } from 'next/font/google'
import { CustomCursor } from '@/components/custom-cursor'
import './globals.css'

const jua = Jua({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const gowunDodum = Gowun_Dodum({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: '형서마트 · 포트폴리오',
  description: '형서마트에 오신 것을 환영합니다. 오늘의 장보기 리스트를 확인해보세요.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#bfe0f4',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${jua.variable} ${gowunDodum.variable} bg-mart-sky`}>
      <body className="font-sans antialiased">
        {children}
        <CustomCursor />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
