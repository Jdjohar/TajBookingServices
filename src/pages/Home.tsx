import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import PopularRoutes from '../components/home/PopularRoutes';
import Testimonials from '../components/home/Testimonials';
import CallToAction from '../components/home/CallToAction';

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <PopularRoutes />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default Home;