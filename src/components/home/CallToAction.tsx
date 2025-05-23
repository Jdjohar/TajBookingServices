import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="overflow-hidden rounded-2xl bg-primary-500 shadow-xl">
          <div className="relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="cta-grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cta-grid)" />
              </svg>
            </div>

            <div className="relative grid gap-8 p-8 md:grid-cols-2 md:p-12 lg:p-16">
              <div className="text-white">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="mb-4 font-heading text-3xl font-bold md:text-4xl"
                >
                  Ready to Book Your Premium Airport Transfer?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="mb-6 text-lg text-white/90"
                >
                  Experience hassle-free travel with our private transport service. Fixed prices, comfortable vehicles, and professional drivers.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex flex-wrap gap-4"
                >
                  <Link
                    to="/booking"
                    className="group flex items-center rounded-full bg-accent-500 px-8 py-3 font-semibold text-gray-900 transition-transform hover:scale-105"
                  >
                    Book Now
                    <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/contact"
                    className="rounded-full border border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-primary-500"
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center justify-center"
              >
                <div className="rounded-xl bg-white p-6 text-center shadow-lg">
                  <h3 className="mb-4 font-heading text-xl font-semibold text-gray-900">Why Our Customers Choose Us</h3>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-start">
                      <span className="mr-2 text-xl text-accent-500">✓</span>
                      <span>Fixed, transparent pricing with no hidden fees</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-xl text-accent-500">✓</span>
                      <span>Professional, punctual drivers every time</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-xl text-accent-500">✓</span>
                      <span>Comfortable, well-maintained vehicles</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-xl text-accent-500">✓</span>
                      <span>Easy online booking and secure payment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-xl text-accent-500">✓</span>
                      <span>24/7 customer support for peace of mind</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;