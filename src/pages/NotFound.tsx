import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowRight } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-4 font-heading text-9xl font-bold text-primary-500">404</h1>
          <h2 className="mb-4 font-heading text-3xl font-bold text-gray-900">Page Not Found</h2>
          <p className="mb-8 text-lg text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              to="/"
              className="flex items-center rounded-full bg-primary-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-600"
            >
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
            <Link
              to="/booking"
              className="flex items-center rounded-full border border-primary-500 px-8 py-3 font-semibold text-primary-500 transition-colors hover:bg-primary-50"
            >
              Book a Transfer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;