import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"


export const metadata: Metadata = {
  title: "Система управления производством",
  description: "Система управления производством одежды",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster richColors />
      </body>
    </html>
  )
}
