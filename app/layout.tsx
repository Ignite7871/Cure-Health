import type React from "react"
import type { Metadata } from "next"
import { Inter, Merriweather } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-merriweather",
})

export const metadata: Metadata = {
  title: {
    default: "AI Healthcare Assistant",
    template: "%s | AI Healthcare Assistant",
  },
  description:
    "Get personalized health insights and recommendations with our AI-powered symptom analysis. Professional healthcare guidance at your fingertips.",
  keywords: [
    "healthcare",
    "AI",
    "symptom checker",
    "health assessment",
    "medical advice",
    "telemedicine",
    "health recommendations",
  ],
  authors: [{ name: "AI Healthcare Assistant Team" }],
  creator: "AI Healthcare Assistant",
  publisher: "AI Healthcare Assistant",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "AI Healthcare Assistant",
    description:
      "Get personalized health insights and recommendations with our AI-powered symptom analysis. Professional healthcare guidance at your fingertips.",
    siteName: "AI Healthcare Assistant",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Healthcare Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Healthcare Assistant",
    description:
      "Get personalized health insights and recommendations with our AI-powered symptom analysis. Professional healthcare guidance at your fingertips.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable} antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d9488" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
