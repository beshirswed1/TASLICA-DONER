// app/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/store/productSlice';
import { RootState, AppDispatch } from '@/store/store';

// استدعاء المكونات الجديدة
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';

export default function UserMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: products, status } = useSelector((state: RootState) => state.products);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // مهم جداً: تأكد من تغيير اتجاه الصفحة ليتناسب مع اللغة التركية
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'tr';
    
    if (status === 'idle') dispatch(fetchProducts());
  }, [status, dispatch]);

  // إخفاء الوجبات غير المفعلة
  const visibleProducts = products.filter(p => p.is_visible);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar cartCount={cartItems.length} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {/* حالة التحميل (Skeleton Cards) */}
        {status === 'loading' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100 flex flex-col">
                <div className="h-56 bg-gray-200 rounded-t-2xl"></div>
                <div className="p-5 space-y-3 flex-grow">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* عرض المنتجات */}
     {/* عرض المنتجات */}
{status === 'succeeded' && (
  <div className="
    grid 
    grid-cols-2          
    md:grid-cols-3       
    lg:grid-cols-4       
    xl:grid-cols-4      
    gap-3                
    md:gap-6           
    p-2                  
    md:p-4
  ">
    {visibleProducts.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
)}
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <Footer />
    </div>
  );
}