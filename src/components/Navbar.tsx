"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { GraduationCap, Github } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Title - Sooner Planner */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-crimson-600 group-hover:bg-crimson-700 transition-colors">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-crimson-600 group-hover:text-crimson-700 transition-colors cursor-pointer">
                Sooner Planner
              </span>
              <span className="text-xs text-gray-500">
                Plan your academic journey
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/how-it-works" 
              className="text-gray-700 hover:text-crimson-600 transition-colors cursor-pointer font-medium"
            >
              How It Works
            </Link>

            {/* GitHub Button */}
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="border-gray-300 hover:border-crimson-300 hover:bg-crimson-50 transition-all"
            >
              <a 
                href="https://github.com/kairugakuo2/sooner-planner" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;