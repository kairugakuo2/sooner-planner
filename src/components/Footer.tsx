import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Github, 
  Twitter, 
  Mail, 
  Heart, 
  GraduationCap,
  ExternalLink,
  BookOpen,
  Users,
  Code
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-crimson-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-crimson-600">Sooner Planner</span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Helping OU students plan their academic journey with an open-source course scheduling tool.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <a 
                  href="https://github.com/kairugakuo2/sooner-planner" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-crimson-600"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a 
                  href="mailto:contact@soonerplanner.com" 
                  className="text-gray-600 hover:text-crimson-600"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/how-it-works" 
                  className="text-sm text-gray-600 hover:text-crimson-600 transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link 
                  href="/planner" 
                  className="text-sm text-gray-600 hover:text-crimson-600 transition-colors"
                >
                  Course Planner
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-sm text-gray-600 hover:text-crimson-600 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-sm text-gray-600 hover:text-crimson-600 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/course-catalog" 
                  className="text-sm text-gray-600 hover:text-crimson-600 transition-colors"
                >
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link 
                  href="/degree-requirements" 
                  className="text-sm text-gray-600 hover:text-crimson-600 transition-colors"
                >
                  Degree Requirements
                </Link>
              </li>
              <li>
                <Link 
                  href="/academic-calendar" 
                  className="text-sm text-gray-600 hover:text-crimson-600 transition-colors"
                >
                  Academic Calendar
                </Link>
              </li>
              <li>
                <Link 
                  href="/advising" 
                  className="text-sm text-gray-600 hover:text-crimson-600 transition-colors"
                >
                  Academic Advising
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Project Info</h3>
            <div className="space-y-3">
              <Badge variant="secondary" className="bg-crimson-50 text-crimson-700 border-crimson-200">
                <Code className="h-3 w-3 mr-1" />
                Open Source
              </Badge>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                <Users className="h-3 w-3 mr-1" />
                Community Driven
              </Badge>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                <BookOpen className="h-3 w-3 mr-1" />
                Educational
              </Badge>
            </div>
            <div className="pt-2">
              <Button size="sm" asChild>
                <a 
                  href="https://github.com/kairugakuo2/sooner-planner" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <Github className="h-4 w-4" />
                  <span>View on GitHub</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>© {currentYear} Sooner Planner. Made with</span>
              <Heart className="h-4 w-4 text-crimson-600" />
              <span>for OU students.</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-crimson-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-crimson-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contributing" className="hover:text-crimson-600 transition-colors">
                Contributing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
