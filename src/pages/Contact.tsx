import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-600 py-20 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-6 font-heading text-4xl font-bold md:text-5xl">Get in Touch</h1>
            <p className="text-lg text-primary-100">
              Have questions about our service? We're here to help. Contact us through any of the channels below.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-white p-8 text-center shadow-lg"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
              <Phone className="h-8 w-8 text-primary-500" />
            </div>
            <h3 className="mb-2 font-heading text-xl font-semibold text-gray-900">Phone</h3>
            <p className="text-gray-600">24/7 Customer Support</p>
            <a href="tel:1-800-AIRPORT" className="mt-2 block text-lg font-medium text-primary-500 hover:text-primary-600">
              1-800-AIRPORT
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl bg-white p-8 text-center shadow-lg"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
              <Mail className="h-8 w-8 text-primary-500" />
            </div>
            <h3 className="mb-2 font-heading text-xl font-semibold text-gray-900">Email</h3>
            <p className="text-gray-600">Send us a message anytime</p>
            <a
              href="mailto:info@airporttransfers.com"
              className="mt-2 block text-lg font-medium text-primary-500 hover:text-primary-600"
            >
              info@airporttransfers.com
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl bg-white p-8 text-center shadow-lg"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
              <MapPin className="h-8 w-8 text-primary-500" />
            </div>
            <h3 className="mb-2 font-heading text-xl font-semibold text-gray-900">Office</h3>
            <p className="text-gray-600">Visit our main office</p>
            <p className="mt-2 text-lg font-medium text-primary-500">
              123 Airport Road, Suite 456
              <br />
              Transport City, TC 12345
            </p>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-16 max-w-2xl rounded-xl bg-white p-8 shadow-lg"
        >
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-heading text-2xl font-bold text-gray-900">Send Us a Message</h2>
            <p className="text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-lg bg-primary-500 px-8 py-4 font-semibold text-white transition-colors hover:bg-primary-600 disabled:bg-primary-300"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Map */}
      <div className="h-96 w-full bg-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596073366!2d-74.25987368715491!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645564749296!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;