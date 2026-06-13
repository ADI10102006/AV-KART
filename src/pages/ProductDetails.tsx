import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, ShieldCheck, Truck, RotateCcw, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';
import ThreeSixtyViewer from '../components/ThreeSixtyViewer';
import ReviewSection from '../components/ReviewSection';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleWishlist, wishlist } = useStore();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setProduct(data);
      else navigate('/shop');
      setLoading(false);
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) return <div className="pt-32 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;
  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image_url: product.image_url,
      quantity: 1
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="pt-24 pb-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <button onClick={() => navigate('/')}>Home</button>
          <ChevronRight size={14} />
          <button onClick={() => navigate('/shop')}>Shop</button>
          <ChevronRight size={14} />
          <span className="text-primary font-medium truncate">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 360 Viewer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ThreeSixtyViewer imageUrl={product.image_url} title={product.title} />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold dark:text-white mb-4">{product.title}</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={18} fill="currentColor" />
                  <span className="font-bold dark:text-white">{product.rating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500 dark:text-gray-400">{product.rating_count} Reviews</span>
                <span className="text-gray-400">|</span>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-primary">₹{product.price}</span>
                {product.original_price && (
                  <span className="text-xl text-gray-400 line-through">₹{product.original_price}</span>
                )}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              {product.description || "Indulge in the timeless elegance of this handcrafted piece. Designed for those who appreciate the finer things in life, this jewelry combines classic aesthetics with modern craftsmanship."}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Material</p>
                <p className="font-bold dark:text-white">{product.material || 'Premium Alloy'}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Style</p>
                <p className="font-bold dark:text-white">{product.style || 'Contemporary'}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-center gap-2 font-bold ${
                  isWishlisted 
                    ? 'bg-red-50 text-red-500 border-red-100' 
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-50'
                }`}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t dark:border-gray-800">
              <div className="text-center">
                <div className="flex justify-center mb-2 text-primary"><Truck size={24} /></div>
                <p className="text-[10px] uppercase font-bold dark:text-gray-400">Fast Delivery</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2 text-primary"><ShieldCheck size={24} /></div>
                <p className="text-[10px] uppercase font-bold dark:text-gray-400">Certified</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2 text-primary"><RotateCcw size={24} /></div>
                <p className="text-[10px] uppercase font-bold dark:text-gray-400">Easy Returns</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetails;
