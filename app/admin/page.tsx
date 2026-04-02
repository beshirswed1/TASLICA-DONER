'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/store/productSlice';
import { RootState, AppDispatch } from '@/store/store';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trash2, Eye, EyeOff, Plus, Loader2, ArrowLeft, Search, 
  Image as ImageIcon, Filter, CheckCircle2, XCircle, Edit3, 
  LayoutDashboard, Package, Tag, Link as LinkIcon
} from 'lucide-react';

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: products, status } = useSelector((state: RootState) => state.products);
  
  // States للنموذج
  const [form, setForm] = useState({ id: '', name: '', price: '', category: '', description: '', image_url: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [inputImageUrl, setInputImageUrl] = useState(''); // حالة جديدة لرابط الصورة الخارجي
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // States للواجهة والتحكم
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  // States للإشعارات (Toast)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | null }>({ message: '', type: null });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  // معالجة رفع الملف من الجهاز
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setInputImageUrl(''); // تفريغ حقل الرابط إذا اختار ملفاً
    }
  };

  // معالجة لصق رابط صورة خارجي
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setInputImageUrl(url);
    setImagePreview(url || null);
    setImageFile(null); // تفريغ الملف إذا قام بلصق رابط
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let finalImageUrl = form.image_url;

    try {
      // 1. إذا كان هناك ملف مرفوع، نرفعه لـ Supabase
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('menu-images').upload(fileName, imageFile);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('menu-images').getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      } 
      // 2. إذا لم يكن هناك ملف ولكن قام بلصق رابط، نستخدم الرابط مباشرة
      else if (inputImageUrl) {
        finalImageUrl = inputImageUrl;
      }

      const productData = {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        description: form.description,
        image_url: finalImageUrl
      };

      if (isEditing) {
        const { error } = await supabase.from('products').update(productData).eq('id', form.id);
        if (error) throw error;
        showToast('Ürün başarıyla güncellendi!', 'success');
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        showToast('Yeni ürün eklendi!', 'success');
      }

      resetForm();
      dispatch(fetchProducts());

    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Bir hata oluştu.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = (product: any) => {
    setForm({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description || '',
      image_url: product.image_url || ''
    });
    setImagePreview(product.image_url || null);
    setInputImageUrl(product.image_url || ''); // وضع الرابط في الحقل إذا كان موجوداً
    setImageFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({ id: '', name: '', price: '', category: '', description: '', image_url: '' });
    setImageFile(null);
    setInputImageUrl('');
    setImagePreview(null);
    setIsEditing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`"${name}" adlı ürünü silmek istediğinize emin misiniz?`)) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        showToast('Silme işlemi başarısız.', 'error');
      } else {
        showToast('Ürün silindi.', 'success');
        dispatch(fetchProducts());
      }
    }
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    await supabase.from('products').update({ is_visible: !current }).eq('id', id);
    dispatch(fetchProducts());
  };

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, filterCategory]);

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter(p => p.is_visible).length,
    categories: categories.length - 1
  }), [products, categories]);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      
      {toast.type && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-6 py-4 rounded-xl shadow-2xl animate-slide-in-right ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle2 /> : <XCircle />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-900">
            <LayoutDashboard className="text-orange-600" />
            <h1 className="text-xl font-bold tracking-tight">Yönetici Paneli</h1>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors bg-gray-50 hover:bg-orange-50 px-4 py-2 rounded-lg">
            <ArrowLeft size={16} /> Menüye Dön
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 p-4 rounded-xl"><Package size={24} /></div>
            <div><p className="text-sm text-gray-500 font-medium">Toplam Ürün</p><p className="text-2xl font-black">{stats.total}</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-green-50 text-green-600 p-4 rounded-xl"><Eye size={24} /></div>
            <div><p className="text-sm text-gray-500 font-medium">Aktif (Görünür)</p><p className="text-2xl font-black">{stats.active}</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-purple-50 text-purple-600 p-4 rounded-xl"><Tag size={24} /></div>
            <div><p className="text-sm text-gray-500 font-medium">Kategori</p><p className="text-2xl font-black">{stats.categories}</p></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${isEditing ? 'bg-blue-500' : 'bg-orange-500'}`} />
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">{isEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
                {isEditing && (
                  <button onClick={resetForm} className="text-xs text-gray-500 hover:text-red-500 underline">İptal</button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* منطقة الصورة (ملف + رابط) */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700">Ürün Görseli</label>
                  
                

                  {/* حقل لصق الرابط */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input 
                      type="url" 
                      placeholder=" görsel linki yapıştır (URL)" 
                      className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm" 
                      value={inputImageUrl} 
                      onChange={handleUrlChange} 
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Ürün Adı</label>
                    <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Örn: Karışık Kebap" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Fiyat (₺)</label>
                      <input required type="number" step="0.01" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-mono" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="0.00" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Kategori</label>
                      <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Örn: Tatlılar" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Açıklama</label>
                    <textarea rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="İçindekiler, porsiyon bilgisi vb." />
                  </div>
                </div>

                <button disabled={uploading} type="submit" className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex justify-center items-center gap-2 active:scale-95 ${isEditing ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/30'}`}>
                  {uploading ? <Loader2 className="animate-spin" /> : <>{isEditing ? <Edit3 size={18} /> : <Plus size={18} />} {isEditing ? 'Değişiklikleri Kaydet' : 'Menüye Ekle'}</>}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col h-[calc(100vh-12rem)]">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
              
              <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4 bg-gray-50/50">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Ürün ara..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="relative min-w-[180px]">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none appearance-none text-sm font-medium" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'Tüm Kategoriler' : cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex-grow overflow-auto">
                {status === 'loading' ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-orange-500" />
                    <p>Ürünler yükleniyor...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Package className="w-12 h-12 mb-4 opacity-20" />
                    <p>Gösterilecek ürün bulunamadı.</p>
                  </div>
                ) : (
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-md">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ürün</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fiyat</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/80 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200 flex-shrink-0">
                                {/* استخدام unoptimized هنا أيضاً */}
                                {p.image_url ? <Image src={p.image_url} alt="" fill className="object-cover" unoptimized /> : <ImageIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm truncate max-w-[200px]">{p.name}</p>
                                <p className="text-xs text-gray-500">{p.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">{p.price} ₺</span>
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => toggleVisibility(p.id, p.is_visible)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${p.is_visible ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                              {p.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                              {p.is_visible ? 'Aktif' : 'Gizli'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditClick(p)} className="p-2 text-gray-500 hover:text-blue-600 bg-white border border-gray-200 hover:border-blue-200 rounded-lg shadow-sm transition-all" title="Düzenle">
                                <Edit3 size={16} />
                              </button>
                              <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-gray-500 hover:text-red-600 bg-white border border-gray-200 hover:border-red-200 rounded-lg shadow-sm transition-all" title="Sil">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}