import { Cart, CartItem, isCartItem } from '@/interfaces/cart';
import { Product, ProductItemPreview } from '@/interfaces/product/product';
import storageKeys from '@/constants/storageKeys';
import { roundPrice } from '@/utils/helpers';
import LocalStorageService from './storage.service';

export default class CartService {
  public static readonly initialCartState: Cart = {
    totalAmount: 0,
    totalPrice: 0,
    items: [],
  };

  public static addItems(item: ProductItemPreview | CartItem, currentState: Cart): Cart {
    let cartItem: CartItem;
    if (!isCartItem(item)) {
      cartItem = {
        info: item,
        total: 1,
      };
    } else {
      cartItem = item;
    }

    return {
      totalAmount: currentState.totalAmount + cartItem.total,
      totalPrice: roundPrice(currentState.totalPrice + roundPrice(cartItem.total * cartItem.info.price)),
      items: this.addToCart(cartItem, currentState.items),
    };
  }

  public static removeItem(item: ProductItemPreview, currentState: Cart): Cart {
    return {
      totalAmount: currentState.totalAmount - 1,
      totalPrice: roundPrice(currentState.totalPrice - item.price),
      items: this.removeFromCart(item, currentState.items),
    };
  }

  public static removeAllItem(item: ProductItemPreview, currentState: Cart): Cart {
    const itm = currentState.items.find((i: CartItem) => i.info._id === item._id)!;
    return {
      totalAmount: currentState.totalAmount - itm.total,
      totalPrice: roundPrice(currentState.totalPrice - roundPrice(itm.total * itm.info.price)),
      items: currentState.items.filter((i: CartItem) => i.info._id !== item._id),
    };
  }

  public static prepareItem(product: Product, amount: number): CartItem {
    const info: ProductItemPreview = {
      _id: product._id,
      name: product.name,
      rate: product.rate || 0,
      images: product.images,
      price: product.price,
      categories: product.categories,
      dateAdded: product.dateAdded,
    };
    return {
      total: amount,
      info,
    };
  }

  public static saveInStorage(cart: Cart) {
    LocalStorageService.set<Cart>(storageKeys.Cart, cart);
  }

  public static getFromStorage(): Cart {
    return LocalStorageService.get<Cart>(storageKeys.Cart) || this.initialCartState;
  }

  private static removeFromCart(item: ProductItemPreview, array: CartItem[]): CartItem[] {
    const cart = [...array];
    const idx = cart.findIndex((i: CartItem) => i.info._id === item._id);
    if (idx < 0) {
      console.error('Provided item don are not presented on cart');
      return cart;
    }

    if (cart[idx].total === 1) {
      cart.splice(idx, 1);
    } else {
      cart[idx] = {
        ...cart[idx],
        total: cart[idx].total - 1,
      };
    }

    return cart;
  }

  private static addToCart(item: CartItem, array: CartItem[]): CartItem[] {
    const cart = [...array];
    const idx = cart.findIndex((c: CartItem) => c.info._id === item.info._id);

    if (idx >= 0) {
      cart[idx] = {
        ...cart[idx],
        total: cart[idx].total + item.total,
      };
    } else {
      cart.push(item);
    }

    return cart;
  }
}
