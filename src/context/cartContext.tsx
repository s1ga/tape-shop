/* eslint-disable no-unused-vars */
import storageKeys from '@/constants/storageKeys';
import { CartContextProps, Cart, CartItem, isCartItem } from '@/interfaces/cart';
import { Product, ProductItemPreview } from '@/interfaces/product/product';
import CartService from '@/services/cart.service';
import ToastService from '@/services/toast.service';
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '@/styles/modules/Home.module.scss';

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

  const checkAvailability = (items: ProductItemPreview | CartItem) => {
    let id: string;
    let newTotal: number;
    let availability: Product['availability'];
    if (isCartItem(items)) {
      newTotal = items.total;
      availability = items.info.availability;
      id = items.info._id;
    } else {
      newTotal = 1;
      availability = items.availability;
      id = items._id;
    }

    if (availability === null || availability === undefined) {
      return true;
    }
    const currentTotal = cart.items.find((i: CartItem) => i.info._id === id)?.total || 0;
    return currentTotal + newTotal <= availability;
  };

  const addItems = (items: ProductItemPreview | CartItem) => {
    if (!checkAvailability(items)) {
      ToastService.error(
        'You cannot add that amount to the cart — total amount will be more than we have in stock.',
      );
      return;
    }
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
    const handler = (e: StorageEvent) => {
      if (e.key === storageKeys.Cart) {
        action.current = undefined;
        setCart(JSON.parse(e.newValue as string));
      }
    };
    window.addEventListener('storage', handler);
    setCart(CartService.getFromStorage());

    return () => {
      window.removeEventListener('storage', handler);
    };
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
      <ToastContainer className={styles.toasterContainer} />
    </CartContext.Provider>
  );
};
