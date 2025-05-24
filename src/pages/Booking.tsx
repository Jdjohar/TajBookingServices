import BookingForm from '../components/booking/BookingForm';
import { motion } from 'framer-motion';

const Booking = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-4 font-heading text-3xl font-bold text-gray-900 md:text-4xl">
            Book Your Private Transfer
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Choose your pickup and dropoff locations, select your preferred vehicle, and complete your booking in just a few steps.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BookingForm />
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;