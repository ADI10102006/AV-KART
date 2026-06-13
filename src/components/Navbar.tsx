import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, Sun, Moon, LogOut, Package, Settings, ChevronDown, LayoutDashboard, Home, Briefcase } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { cart, wishlist, user, setUser } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsUserMenuOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Shop', path: '/shop' },
    { name: 'Services', path: '/services', icon: <Briefcase size={18} /> },
    { name: 'Collections', path: '/collections' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled
          ? 'py-3 bg-white/70 dark:bg-black/70 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-b border-primary/20 dark:border-primary/10'
          : 'py-8 bg-transparent'
      }`}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo with Shimmer and Magnetic Effect */}
          <Link to="/" className="flex items-center group relative">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative logo-shimmer rounded-lg overflow-hidden p-1"
            >
              <img
                src="https://images.dualite.app/4137d61e-dfb1-45e3-9e41-2815c69c3845/asset-502942cd-a8ed-46fa-8b92-154933079bc7.webp"
                alt="AV KART"
                className="h-10 w-auto object-contain transition-all filter drop-shadow-[0_0_8px_rgba(184,134,11,0.3)]"
              />
            </motion.div>
            <motion.div 
              className="absolute -inset-2 bg-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
              layoutId="logo-glow"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-bold tracking-[0.1em] uppercase transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-gray-800 dark:text-gray-200 hover:text-primary'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className="p-2.5 text-gray-800 dark:text-gray-200 hover:scale-110 transition-all glass-gold rounded-full"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <Link to="/wishlist" className="p-2.5 relative text-gray-800 dark:text-gray-200 hover:scale-110 transition-all glass-gold rounded-full">
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full shadow-lg font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="p-2.5 relative text-gray-800 dark:text-gray-200 hover:scale-110 transition-all glass-gold rounded-full">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full shadow-lg font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 bg-white/30 dark:bg-gray-800/50 backdrop-blur-md rounded-full hover:bg-white/50 dark:hover:bg-gray-700 transition-all border border-primary/20"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center text-xs font-bold shadow-lg">
                    {user.full_name?.[0] || user.email[0].toUpperCase()}
                  </div>
                  <ChevronDown size={14} className={`dark:text-white transition-transform duration-300 mr-2 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-64 bg-white/90 dark:bg-gray-950/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-primary/10 overflow-hidden"
                    >
                      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-primary/5">
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Premium Member</p>
                        <p className="text-sm font-bold dark:text-white truncate">{user.email}</p>
                      </div>
                      <div className="p-3">
                        {user.role === 'admin' && (
                          <Link 
                            to="/admin" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-primary font-bold hover:bg-primary/10 rounded-2xl transition-all mb-1"
                          >
                            <LayoutDashboard size={18} /> Admin Dashboard
                          </Link>
                        )}
                        <Link 
                          to="/orders" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all"
                        >
                          <Package size={18} /> My Orders
                        </Link>
                        <Link 
                          to="/profile" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all"
                        >
                          <Settings size={18} /> Profile Settings
                        </Link>
                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 mx-2" />
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-2xl transition-all"
                        >
                          <LogOut size={18} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="p-2.5 text-gray-800 dark:text-gray-200 hover:scale-110 transition-all glass-gold rounded-full">
                <User size={18} />
              </Link>
            )}

            <button
              className="md:hidden p-2 text-gray-800 dark:text-gray-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl border-t border-primary/10 overflow-hidden"
          >
            <div className="px-6 pt-6 pb-10 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-5 py-4 text-base font-bold text-gray-800 dark:text-gray-200 hover:bg-primary/10 rounded-2xl transition-all"
                >
                  {link.icon || <Home size={20} />} {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
