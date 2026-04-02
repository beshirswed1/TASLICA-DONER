import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
  description: string;
  is_visible: boolean;
}

interface ProductState {
  data: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// جلب البيانات من قاعدة البيانات
export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Product[];
});

const productSlice = createSlice({
  name: 'products',
  initialState: { data: [], status: 'idle' } as ProductState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      });
  }
});

export default productSlice.reducer;