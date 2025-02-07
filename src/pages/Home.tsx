import React from 'react';
import Carousel from '../components/Carousel';
import SecondaryNavigation from '../components/SecondaryNavigation';

export default function Home() {
  return (
    <div>
      <Carousel />
      <SecondaryNavigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Welcome Home</h1>
          <p className="text-gray-600">
            This is your homepage with the carousel banner and main content.
            Navigate through the site using the menu above.
          </p>
        </div>
      </main>
    </div>
  );
}