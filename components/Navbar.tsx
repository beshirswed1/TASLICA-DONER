'use client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUtensils } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  // حالة للتحكم في الأنيميشن الخاص بالرقم
  const [isAnimating, setIsAnimating] = useState(false);

  // تشغيل تأثير النبض فقط عندما يتغير رقم السلة ويكون أكبر من صفر
  useEffect(() => {
    if (cartCount > 0) {
      setIsAnimating(true);
      // إيقاف الأنيميشن بعد 300 ملي ثانية (مدة الحركة)
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <nav className="bg-white/85 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
        
        {/* قسم الشعار (Logo) */}
        <div className="flex items-center gap-3 text-orange-600 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="bg-orange-100 p-2 sm:p-2.5 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faUtensils} className="text-lg sm:text-xl" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">TAŞLICA DÖNER</h1>
        </div>
        
        {/* زر السلة الاحترافي */}
        <button 
          onClick={onOpenCart} 
          aria-label="Sepeti Aç"
          className="relative group flex items-center gap-2 bg-orange-50 hover:bg-orange-100 p-3 sm:px-5 sm:py-2.5 rounded-full text-orange-600 transition-all duration-300 active:scale-95"
        >
          <FontAwesomeIcon 
            icon={faShoppingCart} 
            size="lg" 
            className="group-hover:rotate-12 transition-transform duration-300" 
          />
          
          {/* تظهر الكلمة فقط على الشاشات الكبيرة لتجربة مستخدم أفضل */}
          <span className="hidden sm:inline font-bold">Sepetim</span>

          {/* عداد السلة الذكي */}
          {cartCount > 0 && (
            <span 
              className={`
                absolute -top-1.5 -right-1.5 sm:static sm:-ml-1 sm:mr-0 
                bg-red-500 text-white text-[10px] sm:text-xs font-bold 
                rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center shadow-md 
                transform transition-all duration-300 ease-out
                ${isAnimating ? 'scale-125 bg-red-600 shadow-red-500/50' : 'scale-100'}
              `}
            >
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </button>

      </div>
    </nav>
  );
}