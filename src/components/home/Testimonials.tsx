import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'New York, NY',
    quote: 'The service was outstanding. My driver was waiting for me at the airport, helped with my luggage, and got me to my hotel safely. Highly recommend!',
    rating: 5,
    image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 2,
    name: 'Michael Torres',
    location: 'Chicago, IL',
    quote: 'Punctual, professional, and a pleasure to ride with. The fixed pricing meant no surprises, and the vehicle was spotless. Will use again!',
    rating: 5,
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 3,
    name: 'Emily Williams',
    location: 'San Francisco, CA',
    quote: 'I travel frequently for business and this service has become my go-to for airport transfers. Reliable, comfortable, and the advance booking is so convenient.',
    rating: 4,
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((current + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-gray-900 md:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            We pride ourselves on delivering exceptional service that keeps our customers coming back.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl bg-white p-8 shadow-lg md:p-12"
            >
              <div className="flex flex-col items-center md:flex-row">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <div className="h-24 w-24 overflow-hidden rounded-full">
                    <img
                      src={testimonials[current].image}
                      alt={testimonials[current].name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <div className="mb-2 flex justify-center md:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        fill={i < testimonials[current].rating ? 'currentColor' : 'none'}
                        className={`h-5 w-5 ${i < testimonials[current].rating ? 'text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <blockquote className="mb-4 text-lg italic text-gray-700">
                    "{testimonials[current].quote}"
                  </blockquote>
                  <cite className="not-italic">
                    <span className="font-medium text-gray-900">{testimonials[current].name}</span>
                    <span className="block text-sm text-gray-500">{testimonials[current].location}</span>
                  </cite>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-md transition-colors hover:bg-primary-500 hover:text-white focus:outline-none"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-3 w-3 rounded-full ${
                    current === i ? 'bg-primary-500' : 'bg-gray-300'
                  } transition-colors`}
                  aria-label={`Go to testimonial ${i + 1}`}
                ></button>
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-md transition-colors hover:bg-primary-500 hover:text-white focus:outline-none"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;