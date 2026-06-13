import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Sparkles, Play, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);

  useEffect(() => {
    const fetchTrending = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('rating', { ascending: false })
        .limit(8);
      
      if (data) setTrendingProducts(data);
      setLoading(false);
    };
    fetchTrending();
  }, []);

  return (
    <div className="overflow-x-hidden bg-white dark:bg-gray-950">
      {/* Cinematic High-Quality Video Hero Section */}
      <section className="relative h-[110vh] flex items-center justify-center overflow-hidden bg-black">
        <motion.div style={{ y: y1, scale }} className="absolute inset-0 z-0">
          {/* High-Quality Jewelry Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover relative z-10"
            style={{ filter: 'brightness(0.6)' }}
          >
            {/* Direct High-Quality Video Source */}
            <source src="https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-sparkling-diamond-ring-4433-large.mp4" type="video/mp4" />
          </video>
          
          {/* Premium Overlays */}
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/60 via-transparent to-white dark:to-gray-950"></div>
          
          {/* Diamond Dust Particles */}
          <div className="absolute inset-0 z-20 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        </motion.div>

        <motion.div 
          style={{ opacity }}
          className="relative z-30 text-center px-4 max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-8 py-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full text-accent font-bold tracking-[0.4em] uppercase text-[10px] mb-12 shadow-[0_0_30px_rgba(255,215,0,0.2)]"
          >
            <Sparkles size={16} className="animate-pulse text-accent" /> 
            Heritage Collection 2025
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-7xl md:text-[10rem] font-bold text-white mb-12 leading-[0.85] tracking-tighter"
          >
            Pure <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-300% animate-gradient-x drop-shadow-[0_10px_30px_rgba(184,134,11,0.5)]">
              Brilliance
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-14 font-light tracking-wide leading-relaxed"
          >
            Discover the intersection of ancient craftsmanship and modern luxury. Handcrafted pieces for your most unforgettable moments.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link
              to="/shop"
              className="group relative px-14 py-6 bg-primary text-white rounded-full font-bold transition-all transform hover:scale-105 hover:shadow-[0_0_60px_rgba(184,134,11,0.7)] flex items-center gap-4 glow-gold overflow-hidden"
            >
              <span className="relative z-10">Explore Collection</span>
              <ArrowRight size={22} className="relative z-10 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Link>
            <Link
              to="/services"
              className="group px-14 py-6 bg-white/5 hover:bg-white/10 text-white border border-white/20 backdrop-blur-3xl rounded-full font-bold transition-all flex items-center gap-3"
            >
              <Play size={18} className="fill-white group-hover:scale-110 transition-transform" /> 
              The Craftsmanship
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/40 z-30"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent"></div>
        </motion.div>
      </section>

      {/* Trending Now Section */}
      <section className="py-32 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-20 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="w-full md:w-auto">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="h-px w-12 bg-primary"></div>
              <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] flex items-center gap-2">
                <Zap size={14} className="fill-primary animate-pulse" /> Trending Now
              </span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-bold dark:text-white tracking-tighter leading-none">
              The Season's <br /> <span className="text-gray-300 dark:text-gray-700">Favorites</span>
            </h2>
          </div>
          <Link 
            to="/shop" 
            className="group flex items-center gap-3 px-8 py-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-sm font-bold text-gray-900 dark:text-white hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            View Full Catalog <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative">
          <div className="flex gap-10 overflow-x-auto no-scrollbar px-4 md:px-[calc((100vw-1280px)/2)] pb-20 snap-x">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[320px] animate-pulse bg-gray-100 dark:bg-gray-900 aspect-[4/5] rounded-[3rem]" />
              ))
            ) : (
              trendingProducts.map((product) => (
                <motion.div 
                  key={product.id} 
                  className="min-w-[320px] md:min-w-[380px] snap-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-40 bg-gray-50 dark:bg-black/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Truck className="text-primary" size={36} />, title: "White Glove Delivery", desc: "Insured express shipping on all orders over ₹5,000 with real-time tracking." },
              { icon: <ShieldCheck className="text-primary" size={36} />, title: "Certified Authenticity", desc: "Every gem is ethically sourced and comes with a GIA/IGI certificate." },
              { icon: <RotateCcw className="text-primary" size={36} />, title: "Exquisite Packaging", desc: "Our signature luxury box experience, designed with velvet lining." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group p-12 rounded-[4rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
              >
                <div className="mb-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-[2rem] w-fit shadow-lg group-hover:scale-110 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-6 dark:text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
