import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import { supabase } from './lib/supabase';
import { useStore } from './store/useStore';

function App() {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      }
    });

    // Auth state listener with Deadlock Prevention
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user);
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  const fetchUserProfile = async (authUser: any) => {
    try {
      // Try to get existing profile
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (data) {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          full_name: data.full_name,
          phone: data.phone,
          address: data.address,
        });
      } else {
        // If profile doesn't exist (common for first-time Google login), create it
        const fullName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'User';
        
        const { data: newProfile, error: upsertError } = await supabase
          .from('users')
          .upsert({
            id: authUser.id,
            email: authUser.email!,
            full_name: fullName,
          }, { onConflict: 'id' })
          .select()
          .single();

        if (newProfile) {
          setUser({
            id: authUser.id,
            email: authUser.email!,
            full_name: newProfile.full_name,
          });
        } else {
          setUser({ id: authUser.id, email: authUser.email! });
        }
      }
    } catch (err) {
      console.error('Error fetching/creating profile:', err);
      setUser({ id: authUser.id, email: authUser.email! });
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        <Toaster position="top-center" richColors />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/collections" element={<Shop />} />
            <Route path="/about" element={<div className="pt-32 text-center dark:text-white">About AV KART (Coming Soon)</div>} />
          </Routes>
        </main>
        
        <footer className="bg-gray-50 dark:bg-black py-16 border-t dark:border-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-1">
                <img
                  src="https://images.dualite.app/4137d61e-dfb1-45e3-9e41-2815c69c3845/asset-502942cd-a8ed-46fa-8b92-154933079bc7.webp"
                  alt="AV KART"
                  className="h-10 mb-6"
                />
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  AV KART is your destination for premium, handcrafted jewelry that celebrates life's most precious moments.
                </p>
              </div>
              <div>
                <h4 className="font-bold dark:text-white mb-6 uppercase text-xs tracking-widest">Shop</h4>
                <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                  <li><Link to="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
                  <li><Link to="/shop" className="hover:text-primary transition-colors">Necklaces</Link></li>
                  <li><Link to="/shop" className="hover:text-primary transition-colors">Rings</Link></li>
                  <li><Link to="/shop" className="hover:text-primary transition-colors">Earrings</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold dark:text-white mb-6 uppercase text-xs tracking-widest">Support</h4>
                <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                  <li><Link to="/" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
                  <li><Link to="/" className="hover:text-primary transition-colors">Returns & Exchanges</Link></li>
                  <li><Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/" className="hover:text-primary transition-colors">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold dark:text-white mb-6 uppercase text-xs tracking-widest">Newsletter</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Subscribe for exclusive offers and news.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex-1 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                  <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors">
                    Join
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t dark:border-gray-900 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                © 2025 AV KART. Crafted for elegance and timeless beauty.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
