import { motion } from 'framer-motion';
import { Shield, Clock, DollarSign, Car, Award, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-primary-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-6 font-heading text-4xl font-bold text-gray-900 md:text-5xl">
              Your Trusted Airport Transfer Partner
            </h1>
            <p className="text-lg text-gray-600">
              We provide premium private airport transfers with a focus on reliability, comfort, and exceptional service.
              Our professional drivers and modern fleet ensure a seamless travel experience.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 font-heading text-3xl font-bold text-gray-900">Our Core Values</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              These principles guide everything we do and help us deliver the best possible service to our customers.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Shield className="h-8 w-8 text-primary-500" />,
                title: 'Safety First',
                description: 'Your safety is our top priority. All our vehicles are regularly maintained and our drivers are professionally trained.',
              },
              {
                icon: <Clock className="h-8 w-8 text-primary-500" />,
                title: 'Punctuality',
                description: 'We understand the importance of time in travel. Our service is designed to get you to your destination on schedule.',
              },
              {
                icon: <DollarSign className="h-8 w-8 text-primary-500" />,
                title: 'Transparent Pricing',
                description: 'No hidden fees or surprise charges. Our pricing is clear and competitive for the premium service we provide.',
              },
              {
                icon: <Car className="h-8 w-8 text-primary-500" />,
                title: 'Modern Fleet',
                description: 'Our diverse fleet of well-maintained vehicles caters to different group sizes and comfort preferences.',
              },
              {
                icon: <Award className="h-8 w-8 text-primary-500" />,
                title: 'Professional Service',
                description: 'Our experienced team is committed to providing courteous and professional service at every step.',
              },
              {
                icon: <Users className="h-8 w-8 text-primary-500" />,
                title: 'Customer Focus',
                description: 'We go above and beyond to ensure your complete satisfaction with our service.',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl bg-white p-8 shadow-lg transition-transform hover:scale-105"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                  {value.icon}
                </div>
                <h3 className="mb-3 font-heading text-xl font-semibold text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default About;