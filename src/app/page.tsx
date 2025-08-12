"use client"

import React from 'react';
import { Calendar } from 'lucide-react';
import { Stepper } from '@/components/planner/Stepper';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-crimson-600">
              <Calendar className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-crimson-600">SoonerPlanner</h1>
              <p className="text-lg text-gray-600">Plan your OU semester effortlessly</p>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Make the most of your academic planning with smart scheduling that fits your learning style and preferences.
          </p>
        </header>

        {/* Stepper Component */}
        <Stepper />
      </div>
    </main>
  );
}