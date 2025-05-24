import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, X, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <Car size={32} className="text-primary-500" />
            <span className="font-heading text-xl font-bold text-gray-900">AirportTransfers</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center md:flex">
            <ul className="flex space-x-8">
              <li>
                <Link
                  to="/"
                  className={`font-medium transition-colors hover:text-primary-500 ${
                    isActive('/') ? 'text-primary-500' : 'text-gray-700'
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className={`font-medium transition-colors hover:text-primary-500 ${
                    isActive('/booking') ? 'text-primary-500' : 'text-gray-700'
                  }`}
                >
                  Book Now
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`font-medium transition-colors hover:text-primary-500 ${
                    isActive('/about') ? 'text-primary-500' : 'text-gray-700'
                  }`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`font-medium transition-colors hover:text-primary-500 ${
                    isActive('/contact') ? 'text-primary-500' : 'text-gray-700'
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="hidden items-center space-x-4 md:flex">
            <a href="tel:+123456789" className="flex items-center text-gray-700 hover:text-primary-500">
              <Phone size={18} className="mr-2" />
              <span className="font-medium">1-800-AIRPORT</span>
            </a>
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="rounded-full bg-primary-500 px-5 py-2 font-medium text-white transition-colors hover:bg-primary-600"
              >
                Admin Panel
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-full border border-primary-500 px-5 py-2 font-medium text-primary-500 transition-colors hover:bg-primary-500 hover:text-white"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="text-gray-500 focus:outline-none md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 w-full bg-white shadow-lg md:hidden">
          <div className="container mx-auto px-4 py-4">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className={`block py-2 text-lg font-medium ${
                    isActive('/') ? 'text-primary-500' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className={`block py-2 text-lg font-medium ${
                    isActive('/booking') ? 'text-primary-500' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  Book Now
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`block py-2 text-lg font-medium ${
                    isActive('/about') ? 'text-primary-500' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`block py-2 text-lg font-medium ${
                    isActive('/contact') ? 'text-primary-500' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="tel:+123456789"
                  className="flex items-center py-2 text-lg font-medium text-gray-700"
                  onClick={closeMenu}
                >
                  <Phone size={18} className="mr-2" />
                  <span>1-800-AIRPORT</span>
                </a>
              </li>
              <li>
                {isAuthenticated ? (
                  <Link
                    to="/admin"
                    className="block rounded-full bg-primary-500 py-3 text-center text-lg font-medium text-white"
                    onClick={closeMenu}
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="block rounded-full border border-primary-500 py-3 text-center text-lg font-medium text-primary-500"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;