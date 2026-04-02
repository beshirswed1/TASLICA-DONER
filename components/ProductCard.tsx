'use client';
import { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faImage, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
}

const ProductCard = memo(({ product }: { product: Product }) => {
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);

  const formattedPrice = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(product.price);

  const handleAddToCart = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }

    dispatch(addToCart({ ...product, quantity: 1 }));

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }, [dispatch, product]);

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full overflow-hidden">
      
      {/* 1. حاوية الصورة العلوية */}
      <div className="relative aspect-[4/5] md:aspect-square overflow-hidden m-2 md:m-3 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800">
        {/* شارة التصنيف (Category Badge) */}
        <div className="absolute top-2 left-2 z-20">
          <span className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-900 dark:text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            {product.category}
          </span>
        </div>

        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-300">
            <FontAwesomeIcon icon={faImage} className="text-3xl md:text-5xl mb-2" />
            <span className="text-[10px] md:text-xs uppercase font-semibold">No Image</span>
          </div>
        )}

        {/* تأثير طبقة الحماية عند الحوم */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* 2. محتوى البيانات */}
      <div className="p-3 md:p-5 flex flex-col flex-grow">
        <div className="mb-auto">
          <h3 className="font-bold text-sm md:text-lg text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
            {product.name}
          </h3>
          
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs md:text-sm line-clamp-2 font-light">
            {product.description || "Bu ürün hakkında detaylı bilgi bulunmamaktadır."}
          </p>
        </div>

        {/* 3. السعر والزر */}
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-base md:text-xl font-black text-orange-600 dark:text-orange-500">
              {formattedPrice}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`relative overflow-hidden w-full py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-xs md:text-base transition-all duration-300 flex justify-center items-center gap-2 active:scale-95 ${
              isAdded
                ? 'bg-green-500 text-white shadow-lg shadow-green-200 dark:shadow-green-900/20'
                : 'bg-slate-900 dark:bg-orange-600 text-white hover:bg-orange-600 dark:hover:bg-orange-500 shadow-md hover:shadow-orange-200'
            }`}
          >
            <FontAwesomeIcon
              icon={isAdded ? faCheck : faShoppingCart}
              className={`${isAdded ? 'scale-125' : 'group-hover:-translate-y-1 transition-transform'}`}
            />
            <span>{isAdded ? 'Sepete Eklendi' : 'Ekle'}</span>
            
            {/* تأثير اللمعان عند النجاح */}
            {isAdded && (
              <span className="absolute inset-0 bg-white/20 animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;