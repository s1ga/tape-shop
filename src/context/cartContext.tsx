/* eslint-disable no-unused-vars */
import { CartContextProps, Cart, CartItem } from '@/interfaces/cart';
import { ProductItemPreview } from '@/interfaces/product/product';
import CartService from '@/services/cart.service';
import ToastService from '@/services/toast.service';
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultCartContext: CartContextProps = {
  cart: CartService.initialCartState,
  addItems: () => { },
  removeItem: () => { },
  removeAllItem: () => { },
};

const enum CartActions {
  Add = 'add',
  Remove = 'remove',
}

export const CartContext = createContext<CartContextProps>(defaultCartContext);

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>(CartService.initialCartState);
  const action = useRef<CartActions>();

  const addItems = (items: ProductItemPreview | CartItem) => {
    setCart((state: Cart) => CartService.addItems(items, state));
    action.current = CartActions.Add;
  };
  const removeItem = (item: ProductItemPreview) => {
    setCart((state: Cart) => CartService.removeItem(item, state));
    action.current = CartActions.Remove;
  };

  const removeAllItem = (item: ProductItemPreview) => {
    setCart((state: Cart) => CartService.removeAllItem(item, state));
    action.current = CartActions.Remove;
  };

  useEffect(() => {
    setCart(CartService.getFromStorage());
  }, []);

  useEffect(() => {
    if (!action.current) {
      return;
    }

    let toasterText: string = '';
    if (action.current === CartActions.Add) {
      toasterText = 'Item has been added to cart';
    } else if (action.current === CartActions.Remove) {
      toasterText = 'Item has been removed from cart';
    }

    CartService.saveInStorage(cart);
    ToastService.success(toasterText);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addItems, removeItem, removeAllItem }}>
      {children}
      <ToastContainer />
    </CartContext.Provider>
  );
};
