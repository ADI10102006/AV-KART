import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { cart, wishlist, user, setUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-2 bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg'
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img
              src="https://images.dualite.app/4137d61e-dfb1-45e3-9e41-2815c69c3845/asset-502942cd-a8ed-46fa-8b92-154933079bc7.webp"
              alt="AV KART"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-gray-800 dark:text-gray-200 hover:text-primary transition-colors font-medium">Shop</Link>
            <Link to="/collections" className="text-gray-800 dark:text-gray-200 hover:text-primary transition-colors font-medium">Collections</Link>
            <Link to="/about" className="text-gray-800 dark:text-gray-200 hover:text-primary transition-colors font-medium">About</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link to="/wishlist" className="p-2 relative text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="p-2 relative text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l dark:border-gray-800">
                <div className="hidden lg:block text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Welcome,</p>
                  <p className="text-sm font-bold dark:text-white truncate max-w-[100px]">
                    {user.full_name?.split(' ')[0] || 'User'}
                  </p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <User size={20} />
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
            className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link to="/shop" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300">Shop</Link>
              <Link to="/collections" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300">Collections</Link>
              <Link to="/about" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300">About</Link>
              {user && (
                <div className="px-3 py-2 border-t dark:border-gray-800 mt-2">
                  <p className="text-sm font-bold dark:text-white">Logged in as {user.full_name || user.email}</p>
                </div>
              )}
              {!user && <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300">Login</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
