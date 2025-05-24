import { motion } from 'framer-motion';
import { Clock, DollarSign, Shield, Car, CheckCircle, UserCheck } from 'lucide-react';

const features = [
  {
    icon: <Clock className="text-primary-500" size={24} />,
    title: 'Advance Booking',
    description: 'Book your transfer at least 2 days in advance to ensure availability and prepare for your journey.',
  },
  {
    icon: <DollarSign className="text-primary-500" size={24} />,
    title: 'Fixed Pricing',
    description: 'No surprises or hidden fees. Our transparent pricing is based on your route and vehicle choice.',
  },
  {
    icon: <Shield className="text-primary-500" size={24} />,
    title: 'Secure Payments',
    description: 'Pay securely online with our encrypted payment system powered by Stripe.',
  },
  {
    icon: <Car className="text-primary-500" size={24} />,
    title: 'Multiple Vehicle Options',
    description: 'Choose from our fleet of sedans, SUVs, and vans based on your group size and preferences.',
  },
  {
    icon: <CheckCircle className="text-primary-500" size={24} />,
    title: 'No Sharing',
    description: 'All our transfers are private - you never have to share with other passengers.',
  },
  {
    icon: <UserCheck className="text-primary-500" size={24} />,
    title: 'Professional Drivers',
    description: 'Our experienced, professional drivers ensure a comfortable and safe journey.',
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

const Features = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-gray-900 md:text-4xl">
            Why Choose Our Transport Service?
          </h2>
          <p className="text-lg text-gray-600">
            We provide reliable, comfortable, and premium private transfers with features designed to make your journey stress-free.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="rounded-xl bg-white p-8 shadow-md transition-transform hover:scale-105"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
                {feature.icon}
              </div>
              <h3 className="mb-3 font-heading text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;