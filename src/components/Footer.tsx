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
                <GraduationCap className="h-5 w-5 text-black" />
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
                  href="/about" 
                  className="text-sm text-gray-600 hover:text-crimson-600 transition-colors"
                >
                  About
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
                Built for OU Students
              </Badge>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                <BookOpen className="h-3 w-3 mr-1" />
                Free to Use
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
            <div>
                <Button size="sm" asChild className="hover:bg-gray-300">
                <a 
                  href="https://github.com/kairugakuo2/sooner-planner/issues" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white border-black"
                >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" color="currentColor">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.69667 0.0403541C8.90859 0.131038 9.03106 0.354857 8.99316 0.582235L8.0902 6.00001H12.5C12.6893 6.00001 12.8625 6.10701 12.9472 6.27641C13.0319 6.4458 13.0136 6.6485 12.8999 6.80001L6.89997 14.8C6.76167 14.9844 6.51521 15.0503 6.30328 14.9597C6.09135 14.869 5.96888 14.6452 6.00678 14.4178L6.90974 9H2.49999C2.31061 9 2.13748 8.893 2.05278 8.72361C1.96809 8.55422 1.98636 8.35151 2.09999 8.2L8.09997 0.200038C8.23828 0.0156255 8.48474 -0.0503301 8.69667 0.0403541ZM3.49999 8.00001H7.49997C7.64695 8.00001 7.78648 8.06467 7.88148 8.17682C7.97648 8.28896 8.01733 8.43723 7.99317 8.5822L7.33027 12.5596L11.5 7.00001H7.49997C7.353 7.00001 7.21347 6.93534 7.11846 6.8232C7.02346 6.71105 6.98261 6.56279 7.00678 6.41781L7.66968 2.44042L3.49999 8.00001Z"
                            fill="black"
                        />
                    </svg>

                  <span className="text-black">Report an Issue</span>
                  <ExternalLink className="h-3 w-3 text-black" />
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
