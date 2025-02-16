import { useState } from 'react';
import { Menu, X, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';

const navItems = [
  { name: 'About', href: '/about' },
  { name: 'Donation', href: '/donation' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Contact', href: '/contact' },
  { name: 'Upcomingevents', href: '/upcomingevents' },

];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-gray-800">
            खटाव बिल्डिंग सार्वजनिक उत्सव मंडळ, वर्ष १००
            </Link>
            <Button 
              to="/" 
              variant={location.pathname === '/' ? 'primary' : 'secondary'}
              className="hidden sm:flex"
            >
              <Home className="mr-2" size={18} />
              Home
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  to={item.href}
                  variant={location.pathname === item.href ? 'primary' : 'secondary'}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-2 px-2 pb-3 pt-2">
            <Button
              to="/"
              variant={location.pathname === '/' ? 'primary' : 'secondary'}
              className="w-full justify-start"
            >
              <Home className="mr-2" size={18} />
              Home
            </Button>
            {navItems.map((item) => (
              <Button
                key={item.name}
                to={item.href}
                variant={location.pathname === item.href ? 'primary' : 'secondary'}
                className="w-full justify-start"
              >
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}