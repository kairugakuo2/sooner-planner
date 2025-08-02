import Link from 'next/link';
import React from 'react';


const Navbar = () => {
    return (
        <nav className="flex justify-between items-center px-6 py-4 sticky top-0 z-50 bg-white">
            <div className="flex items-center space-x-6 ">
                <Link href="/">
                    <span className="text-2xl font-bold text-red-600 cursor-pointer">
                        Sooner Planner
                    </span>
                </Link>
                <Link href="/how-it-works">
                    <span className="cursor-pointer hover:text-red-700 transition-colors ">
                        How It Works
                    </span>
                </Link>
            </div>
            <a 
                href="https://github.com/kairugakuo2/sooner-planner" 
                target="_blank" //opens link in new tab
                rel="noopener noreferrer" //security from new tab 
                className="cursor-pointer"
            >
                View on Github
            </a>
        </nav>
    )
}

export default Navbar;