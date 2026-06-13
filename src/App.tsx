import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Services from './pages/Services';
import { supabase } from './lib/supabase';
import { useStore } from './store/useStore';

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const user = useStore((state) => state.user);
  
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

function App() {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      }
    });

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
      // Master Admin Check
      const isMasterAdmin = authUser.email === 'adiarivu2006@gmail.com';

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
          role: isMasterAdmin ? 'admin' : (data.role || 'customer'),
        });

        // Sync role in DB if it's master admin
        if (isMasterAdmin && data.role !== 'admin') {
          await supabase.from('users').update({ role: 'admin' }).eq('id', authUser.id);
        }
      } else {
        const fullName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || (isMasterAdmin ? 'AV Master Admin' : 'Valued Customer');
        
        const { data: newProfile } = await supabase
          .from('users')
          .upsert({
            id: authUser.id,
            email: authUser.email!,
            full_name: fullName,
            role: isMasterAdmin ? 'admin' : 'customer'
          }, { onConflict: 'id' })
          .select()
          .single();

        if (newProfile) {
          setUser({
            id: authUser.id,
            email: authUser.email!,
            full_name: newProfile.full_name,
            phone: newProfile.phone,
            address: newProfile.address,
            role: newProfile.role || 'customer',
          });
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
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
            <Route path="/services" element={<Services />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
            <Route path="/collections" element={<Shop />} />
            <Route path="/about" element={<div className="pt-32 text-center dark:text-white">Our Story (Coming Soon)</div>} />
          </Routes>
        </main>
        
        <footer className="bg-gray-50 dark:bg-black py-20 border-t dark:border-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-1">
                <img
                  src="https://images.dualite.app/4137d61e-dfb1-45e3-9e41-2815c69c3845/asset-502942cd-a8ed-46fa-8b92-154933079bc7.webp"
                  alt="AV KART"
                  className="h-10 mb-8"
                />
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-loose">
                  AV KART is your destination for premium, handcrafted jewelry that celebrates life's most precious moments with timeless elegance.
                </p>
              </div>
              <div>
                <h4 className="font-bold dark:text-white mb-8 uppercase text-[10px] tracking-[0.2em]">Explore</h4>
                <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                  <li><Link to="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
                  <li><Link to="/collections" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                  <li><Link to="/services" className="hover:text-primary transition-colors">Our Services</Link></li>
                  <li><Link to="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold dark:text-white mb-8 uppercase text-[10px] tracking-[0.2em]">Customer Care</h4>
                <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                  <li><Link to="/orders" className="hover:text-primary transition-colors">Track Order</Link></li>
                  <li><Link to="/profile" className="hover:text-primary transition-colors">My Account</Link></li>
                  <li><Link to="/" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
                  <li><Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold dark:text-white mb-8 uppercase text-[10px] tracking-[0.2em]">Stay Inspired</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Join our exclusive circle for early access and news.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex-1 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  />
                  <button className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                    Join
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-10 border-t dark:border-gray-900 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-[0.3em]">
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
