/* eslint-disable no-unused-vars */
import storageKeys from '@/constants/storageKeys';
import { CartContextProps, Cart, CartItem, isCartItem } from '@/interfaces/cart';
import { ProductItemPreview } from '@/interfaces/product/product';
import CartService from '@/services/cart.service';
import ToastService from '@/services/toast.service';
import { ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '@/styles/modules/Home.module.scss';
import { AppliedCoupon } from '@/interfaces/coupon';
import CouponsService from '@/services/coupons.service';

const COUPON_APPLY_CONTEXT_ERROR = 'coupon-context-error';
const OUT_OF_STOCK_TOAST = 'out-of-stack';

const defaultCartContext: CartContextProps = {
  cart: CartService.initialCartState,
  addItems: () => { },
  removeItem: () => { },
  removeAllItem: () => { },
  applyCoupon: () => true,
  resetCoupon: () => { },
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

  const addItems = useCallback(
    (items: ProductItemPreview | CartItem) => {
      if (!CartService.checkAvailability(items, cart)) {
        ToastService.error(
          'You cannot add that amount to the cart — total amount will be more than we have in stock.',
          { toastId: OUT_OF_STOCK_TOAST },
        );
        return;
      }
      action.current = CartActions.Add;
      setCart((state: Cart) => CartService.addItems(items, state));
    },
    [],
  );
  const removeItem = useCallback(
    (item: ProductItemPreview) => {
      action.current = CartActions.Remove;
      setCart((state: Cart) => CartService.removeItem(item, state));
    },
    [],
  );
  const removeAllItem = useCallback(
    (item: ProductItemPreview) => {
      action.current = CartActions.Remove;
      setCart((state: Cart) => CartService.removeAllItem(item, state));
    },
    [],
  );
  const applyCoupon = useCallback(
    (coupon: AppliedCoupon) => {
      action.current = undefined;
      let success: boolean | string = 'skip';
      setCart((state: Cart) => {
        const result = CartService.applyCoupon(state, coupon);
        if (typeof result === 'string') {
          success = false;
          CouponsService.removeFromStorage();
          ToastService.error(result, { toastId: COUPON_APPLY_CONTEXT_ERROR });
          const newState = CartService.resetCoupon(state);
          CartService.saveInStorage(newState);
          return newState;
        }
        success = true;
        CouponsService.saveInStorage(coupon);
        CartService.saveInStorage(result);
        return result;
      });
      return success;
    },
    [],
  );
  const resetCoupon = useCallback(
    () => {
      setCart((state: Cart) => {
        CouponsService.removeFromStorage();
        const result = CartService.resetCoupon(state);
        CartService.saveInStorage(result);
        return result;
      });
    },
    [],
  );

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

    const coupon = CouponsService.getFromStorage();
    if (coupon) {
      applyCoupon(coupon);
    }

    CartService.saveInStorage(cart);
    if (toasterText) {
      ToastService.success(toasterText);
    }
  }, [cart]);

  return (
    <>
      <CartContext.Provider value={{ cart, resetCoupon, addItems, removeItem, removeAllItem, applyCoupon }}>
        {children}
      </CartContext.Provider>
      <ToastContainer className={styles.toasterContainer} />
    </>
  );
};
