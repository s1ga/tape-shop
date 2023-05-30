/* eslint-disable no-unused-vars */
import { ProductItemPreview } from './product/product';

export interface CartContextProps {
  cart: Cart;
  addItems: (items: ProductItemPreview | CartItem) => void;
  removeItem: (item: ProductItemPreview) => void;
  removeAllItem: (item: ProductItemPreview) => void;
}

export interface Cart {
  totalAmount: number;
  totalPrice: number;
  items: CartItem[];
}

export interface CartItem {
  info: ProductItemPreview;
  total: number;
}

export function isCartItem(item: any): item is CartItem {
  const typed = item as CartItem;
  return typed.info !== null && typeof typed.info === 'object' && typeof typed.total === 'number';
}
