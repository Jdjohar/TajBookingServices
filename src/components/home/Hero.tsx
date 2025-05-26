import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 py-20 text-white md:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container relative mx-auto px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg"
          >
            <h1 className="mb-4 font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Premium Private Airport Transfers
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-white/80">
              Book your private airport transfer with fixed prices, professional drivers, and comfortable vehicles. No sharing, no waiting, just smooth travel.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="rounded-full bg-accent-500 px-8 py-4 font-semibold text-gray-900 shadow-lg transition-transform hover:scale-105"
              >
                Book Now
              </Link>
              <Link
                to="/about"
                className="rounded-full border-2 border-white bg-transparent px-8 py-4 font-semibold text-white transition-colors hover:bg-white hover:text-primary-600"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="overflow-hidden rounded-xl">
              <img
                src="https://images.pexels.com/photos/5834939/pexels-photo-5834939.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Premium airport transfer"
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 rounded-lg bg-accent-500 p-4 shadow-xl">
              <div className="text-center font-heading">
                <p className="text-sm font-medium text-gray-800">Starting from</p>
                <p className="text-3xl font-bold text-gray-900">$49</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;