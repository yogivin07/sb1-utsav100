import React from 'react';
import { Compass, Briefcase, Phone, Home } from 'lucide-react';
import Button from './Button';

const navigationItems = [
  {
    icon: Home,
    label: 'Home',
    path: '/',
    description: 'Return to homepage'
  },
  {
    icon: Compass,
    label: 'Donation',
    path: 'https://dancing-marzipan-d5eb05.netlify.app/',
    description: 'Explore our services'
  },
  {
    icon: Briefcase,
    label: 'Portfolio',
    path: 'https://yogendrapawar.wixstudio.com/my-site-3',
    description: 'View our tradition'
  },
  {
    icon: Phone,
    label: 'Contact',
    path: '/contact',
    description: 'Get in touch'
  },
  {
    icon: Compass,
    label: '100 Years',
    path: 'https://yogendrapawar.wixstudio.com/my-site-1',
    description: 'Get in touch'
  },
 
  
  
];

export default function SecondaryNavigation() {
  return (
    <div className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.label}
                to={item.path}
                variant="secondary"
                className="flex flex-col items-center justify-center gap-2 p-6 text-center hover:bg-gray-50"
              >
                <Icon className="h-6 w-6 text-blue-600" />
                <span className="font-medium">{item.label}</span>
                <span className="text-sm text-gray-500">{item.description}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}