import "@/styles/globals.css"
import { ReactNode } from 'react'
import { GeistSans } from 'geist/font/sans'
import Navbar from "@/components/Navbar"

export const metadata = {
    title: 'Sooner Planner',
    description: 'Ou course schedule builder',
}

export default function RootLayout({ children }: { children: ReactNode}) {
    return (
        <html lang="en">
            <body className={GeistSans.className}>
                <Navbar />
                {children}
            </body>
        </html>
    )
}