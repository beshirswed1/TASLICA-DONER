import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
    category: string;
    description: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = { items: [], total: 0 };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    incrementQuantity: (state, action: PayloadAction<string>) => {
  const item = state.items.find(item => item.id === action.payload);
  if (item) {
    item.quantity += 1;
    state.total += item.price;
  }
},
decrementQuantity: (state, action: PayloadAction<string>) => {
  const item = state.items.find(item => item.id === action.payload);
  if (item && item.quantity > 1) {
    item.quantity -= 1;
    state.total -= item.price;
  }
},
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total += action.payload.price;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const existing = state.items.find(item => item.id === action.payload);
      if (existing) {
        state.total -= existing.price * existing.quantity;
        state.items = state.items.filter(item => item.id !== action.payload);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    }
  }
});

export const { addToCart, removeFromCart, clearCart, incrementQuantity, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;