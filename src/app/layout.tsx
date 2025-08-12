import "@/styles/globals.css"
import { ReactNode } from 'react'
import { GeistSans } from 'geist/font/sans'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata = {
    title: 'Sooner Planner',
    description: 'Ou course schedule builder',
}

export default function RootLayout({ children }: { children: ReactNode}) {
    return (
        <html lang="en">
            <body className={`${GeistSans.className} flex flex-col min-h-screen`}>
                <Navbar />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    )
}