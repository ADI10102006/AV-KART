import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    original_price?: number;
    image_url: string;
    rating: number;
    category: string;
    rating_count?: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  
  // Randomly assign badges for "Trending" feel
  const isTrending = product.rating > 4.5;
  const isBestSeller = (product.rating_count || 0) > 1000;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 border border-gray-100 dark:border-gray-800"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleWishlist(product.id)}
            className={`p-4 rounded-full backdrop-blur-xl transition-all duration-300 ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-900 hover:bg-primary hover:text-white'
            }`}
          >
            <Heart size={22} fill={isWishlisted ? 'currentColor' : 'none'} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => addToCart({ ...product, quantity: 1 })}
            className="p-4 bg-white/80 text-gray-900 rounded-full backdrop-blur-xl hover:bg-primary hover:text-white transition-all duration-300"
          >
            <ShoppingCart size={22} />
          </motion.button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isBestSeller && (
            <div className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-md">
              <Sparkles size={12} /> BEST SELLER
            </div>
          )}
          {isTrending && (
            <div className="bg-accent text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-md">
              <TrendingUp size={12} /> TRENDING
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em]">{product.category}</p>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={12} fill="currentColor" />
            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            {product.original_price && (
              <span className="text-xs text-gray-400 line-through mb-1">₹{product.original_price.toLocaleString()}</span>
            )}
            <span className="text-xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
          </div>
          
          <Link 
            to={`/product/${product.id}`}
            className="text-[10px] font-bold text-primary border-b-2 border-primary/20 hover:border-primary transition-all pb-1 uppercase tracking-widest"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
