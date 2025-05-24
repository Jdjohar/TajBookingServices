import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 flex items-center space-x-2">
              <Car size={32} className="text-accent-500" />
              <span className="font-heading text-xl font-bold">AirportTransfers</span>
            </Link>
            <p className="mb-6 text-gray-400">
              Premium private airport transfers. Fixed rates, professional service, and comfortable vehicles.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-accent-500 transition-colors hover:bg-accent-500 hover:text-gray-900"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-accent-500 transition-colors hover:bg-accent-500 hover:text-gray-900"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-accent-500 transition-colors hover:bg-accent-500 hover:text-gray-900"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="inline-block text-gray-400 transition-colors hover:text-accent-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/booking" className="inline-block text-gray-400 transition-colors hover:text-accent-500">
                  Book Now
                </Link>
              </li>
              <li>
                <Link to="/about" className="inline-block text-gray-400 transition-colors hover:text-accent-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="inline-block text-gray-400 transition-colors hover:text-accent-500">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="inline-block text-gray-400 transition-colors hover:text-accent-500">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-lg font-semibold">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Airport Transfers</li>
              <li className="text-gray-400">Hotel Transfers</li>
              <li className="text-gray-400">City to City Transport</li>
              <li className="text-gray-400">Executive Transfers</li>
              <li className="text-gray-400">Family Transfers</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0 text-accent-500" />
                <span className="text-gray-400">123 Airport Road, Suite 456, Transport City, TC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0 text-accent-500" />
                <a href="tel:+123456789" className="text-gray-400 hover:text-accent-500">
                  1-800-AIRPORT
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0 text-accent-500" />
                <a href="mailto:info@airporttransfers.com" className="text-gray-400 hover:text-accent-500">
                  info@airporttransfers.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} AirportTransfers. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy-policy" className="hover:text-accent-500">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-accent-500">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;