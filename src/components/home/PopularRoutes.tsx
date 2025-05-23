import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const popularRoutes = [
  {
    id: 1,
    from: 'JFK Airport',
    to: 'Manhattan',
    price: 79,
    image: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 2,
    from: 'LAX Airport',
    to: 'Downtown LA',
    price: 69,
    image: 'https://images.pexels.com/photos/2598638/pexels-photo-2598638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 3,
    from: 'O\'Hare Airport',
    to: 'Chicago Loop',
    price: 65,
    image: 'https://images.pexels.com/photos/2063021/pexels-photo-2063021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 4,
    from: 'Heathrow Airport',
    to: 'Central London',
    price: 89,
    image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PopularRoutes = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="mb-4 font-heading text-3xl font-bold text-gray-900 md:text-4xl">
              Popular Transfer Routes
            </h2>
            <p className="max-w-2xl text-lg text-gray-600">
              Our most requested airport transfer routes with fixed prices and premium service.
            </p>
          </div>
          <Link
            to="/booking"
            className="flex items-center font-medium text-primary-500 transition-colors hover:text-primary-600"
          >
            View all routes
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {popularRoutes.map((route) => (
            <motion.div
              key={route.id}
              variants={item}
              className="group overflow-hidden rounded-xl bg-white shadow-md transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={route.image}
                  alt={`${route.from} to ${route.to}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center">
                  <span className="text-lg font-medium text-gray-800">{route.from}</span>
                  <ArrowRight size={18} className="mx-2 text-gray-400" />
                  <span className="text-lg font-medium text-gray-800">{route.to}</span>
                </div>
                <div className="mb-4 flex justify-between">
                  <span className="text-2xl font-bold text-primary-500">${route.price}</span>
                  <div className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-600">
                    Fixed price
                  </div>
                </div>
                <Link
                  to="/booking"
                  className="block rounded-lg bg-primary-500 py-2 text-center font-medium text-white transition-colors hover:bg-primary-600"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularRoutes;