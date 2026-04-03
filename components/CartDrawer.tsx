import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { removeFromCart, clearCart, incrementQuantity, decrementQuantity } from '@/store/cartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes, faPaperPlane, faPlus, faMinus, faReceipt, faImage } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const sendOrderToWhatsApp = () => {
    if (items.length === 0) return;
    
    // تنسيق الفاتورة لرسالة الواتساب
    let message = "🧾 *YENİ SİPARİŞ FİŞİ*\n";
    message += "------------------------\n\n";
    
    items.forEach(item => {
      message += `🔸 ${item.name}\n`;
      message += `   ${item.quantity} x ${item.price} ₺ = ${item.price * item.quantity} ₺\n`;
    });
    
    message += "\n------------------------\n";
    message += `💰 *GENEL TOPLAM: ${total} ₺*\n`;
    message += "------------------------\n";
    message += "Lütfen siparişimi onaylayın. Teşekkürler!";
    
    const whatsappUrl = `https://wa.me/+905453155933?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    dispatch(clearCart());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* الخلفية الداكنة */}
      <div className="fixed inset-0 bg-gray-900/60 z-40 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      
      {/* السلة */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[28rem] bg-gray-50 shadow-2xl z-50 flex flex-col animate-slide-in-right">
        
        {/* الهيدر */}
        <div className="p-5 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
              <FontAwesomeIcon icon={faReceipt} size="lg" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">Sipariş Özeti</h2>
              <p className="text-xs text-gray-500 mt-1">{items.length} ürün seçildi</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 hover:rotate-90 transition-all duration-300 p-2 rounded-full w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        
        {/* قائمة المنتجات */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <FontAwesomeIcon icon={faPaperPlane} size="2x" className="opacity-30" />
              </div>
              <p className="text-lg font-bold text-gray-500">Sepetiniz şu an boş</p>
              <p className="text-sm text-center px-8">Lezzetli menümüze göz atın ve favorilerinizi eklemeye başlayın!</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex bg-white p-3 rounded-2xl shadow-sm border border-gray-100 relative group overflow-hidden">
                
                {/* زر الحذف - يظهر في الزاوية العلوية اليمنى */}
                <button 
                  onClick={() => dispatch(removeFromCart(item.id))} 
                  className="absolute top-2 right-2 text-red-300 hover:text-red-500 transition-colors bg-white hover:bg-red-50 p-1.5 rounded-lg z-10 opacity-70 hover:opacity-100"
                  title="Ürünü Sil"
                >
                  <FontAwesomeIcon icon={faTrash} size="sm" />
                </button>

                {/* صورة المنتج */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden mr-3 border border-gray-50">
                  {item.image_url ? (
                    <Image 
                      src={item.image_url} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 768px) 80px, 96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <FontAwesomeIcon icon={faImage} size="lg" />
                    </div>
                  )}
                </div>

                {/* التفاصيل وأدوات التحكم */}
                <div className="flex flex-col flex-grow justify-between py-1 pr-6"> {/* pr-6 لترك مساحة لزر الحذف */}
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-orange-600 font-bold text-sm">{item.price} ₺</p>
                  </div>

                  {/* أدوات التحكم بالكمية والسعر الإجمالي للمنتج */}
                  <div className="flex justify-between items-end mt-2">
                    
                    {/* أزرار + و - */}
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden h-8">
                      <button 
                        onClick={() => dispatch(decrementQuantity(item.id))}
                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                      >
                        <FontAwesomeIcon icon={faMinus} size="xs" />
                      </button>
                      <span className="w-8 h-full flex items-center justify-center font-bold text-gray-900 text-sm bg-white">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => dispatch(incrementQuantity(item.id))}
                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                      >
                        <FontAwesomeIcon icon={faPlus} size="xs" />
                      </button>
                    </div>

                    {/* إجمالي سعر المنتج */}
                    <p className="font-black text-gray-900 text-base sm:text-lg">
                      {item.price * item.quantity} ₺
                    </p>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* الفوتر - ملخص الفاتورة وزر الإرسال */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 bg-white border-t border-gray-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)]">
            
            {/* تفاصيل الفاتورة */}
            <div className="space-y-3 mb-5">
              <div className="flex justify-between items-center text-sm text-gray-500 font-medium">
                <span>Ara Toplam</span>
                <span>{total} ₺</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200">
                <span className="text-gray-900 font-bold text-lg">Genel Toplam</span>
                <span className="text-2xl sm:text-3xl font-black text-orange-600">{total} ₺</span>
              </div>
            </div>

            {/* زر الواتساب */}
            <button 
              onClick={sendOrderToWhatsApp}
              className="w-full bg-green-500 text-white py-3.5 rounded-xl font-bold text-base sm:text-lg hover:bg-green-600 active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-lg shadow-green-500/30"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-lg" /> 
              Siparişi Gönder (WhatsApp)
            </button>
          </div>
        )}

      </div>
    </>
  );
}