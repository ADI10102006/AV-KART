import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Truck, RotateCcw, Gem, Clock, Ruler, HeartHandshake } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Gem className="text-primary" size={40} />,
      title: "Custom Jewelry Design",
      description: "Collaborate with our master artisans to bring your unique vision to life with bespoke handcrafted pieces."
    },
    {
      icon: <ShieldCheck className="text-primary" size={40} />,
      title: "Lifetime Warranty",
      description: "We stand by our craftsmanship. Every AV KART piece comes with a lifetime warranty against manufacturing defects."
    },
    {
      icon: <Clock className="text-primary" size={40} />,
      title: "Professional Cleaning",
      description: "Keep your treasures sparkling. We offer complimentary professional cleaning for all AV KART jewelry."
    },
    {
      icon: <Ruler className="text-primary" size={40} />,
      title: "Resizing & Repairs",
      description: "Expert resizing and restoration services to ensure your jewelry fits perfectly and lasts for generations."
    },
    {
      icon: <Truck className="text-primary" size={40} />,
      title: "Insured Shipping",
      description: "Global express delivery with full insurance coverage, ensuring your precious items arrive safely at your doorstep."
    },
    {
      icon: <HeartHandshake className="text-primary" size={40} />,
      title: "Personal Concierge",
      description: "Our jewelry experts are available for one-on-one consultations to help you find the perfect gift or investment."
    }
  ];

  return (
    <div className="pt-32 pb-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 inline-block"
          >
            Excellence in Service
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold dark:text-white mb-6"
          >
            Premium Care for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Your Treasures</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg"
          >
            At AV KART, we believe our relationship begins after your purchase. Explore our suite of exclusive services designed for the discerning collector.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all group"
            >
              <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-4">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 p-12 rounded-[3rem] bg-primary relative overflow-hidden text-center text-white"
        >
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Expert Advice?</h2>
            <p className="text-white/80 mb-10 max-w-xl mx-auto">
              Our master jewelers and gemologists are ready to assist you with any questions or custom requests.
            </p>
            <button className="px-10 py-4 bg-white text-primary rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl">
              Book a Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
