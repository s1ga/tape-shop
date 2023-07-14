import { Cart, CartItem, isCartItem } from '@/interfaces/cart';
import { Product, ProductItemPreview } from '@/interfaces/product/product';
import storageKeys from '@/constants/storageKeys';
import { formatPrice, roundPrice } from '@/utils/helpers';
import { AppliedCoupon } from '@/interfaces/coupon';
import couponType from '@/constants/coupon';
import LocalStorageService from './storage.service';

export default class CartService {
  private static appliedCouponError: boolean = false;

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
      ...currentState,
      totalAmount: currentState.totalAmount + cartItem.total,
      totalPrice: roundPrice(currentState.totalPrice + roundPrice(cartItem.total * cartItem.info.price)),
      items: this.addToCart(cartItem, currentState.items),
    };
  }

  public static removeItem(item: ProductItemPreview, currentState: Cart): Cart {
    return {
      ...currentState,
      totalAmount: currentState.totalAmount - 1,
      totalPrice: roundPrice(currentState.totalPrice - item.price),
      items: this.removeFromCart(item, currentState.items),
    };
  }

  public static removeAllItem(item: ProductItemPreview, currentState: Cart): Cart {
    const itm = currentState.items.find((i: CartItem) => i.info._id === item._id)!;
    return {
      ...currentState,
      totalAmount: currentState.totalAmount - itm.total,
      totalPrice: roundPrice(currentState.totalPrice - roundPrice(itm.total * itm.info.price)),
      items: currentState.items.filter((i: CartItem) => i.info._id !== item._id),
    };
  }

  public static prepareItem(product: Product, amount: number): CartItem {
    const info: ProductItemPreview = {
      _id: product._id,
      id: product.id,
      name: product.name,
      rate: product.rate || 0,
      images: product.images,
      price: product.price,
      categories: product.categories,
      dateAdded: product.dateAdded,
      availability: product.availability,
      weight: product.weight,
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

  public static applyCoupon(cart: Cart, coupon: AppliedCoupon): Cart | string {
    if (!cart || cart.totalAmount === 0) {
      return cart;
    }

    const itemsToApplyCoupon = coupon.appliedProducts.length
      ? cart.items.filter((i: CartItem) => coupon.appliedProducts.includes(i.info._id))
      : [...cart.items];
    const oldSumOfAppliedProducts = itemsToApplyCoupon
      .reduce((acc: number, curr: CartItem) => acc + (curr.total * curr.info.price), 0);
    if (oldSumOfAppliedProducts < coupon.requiredCartTotal) {
      return `Required minimum total of cart for current coupon is $${formatPrice(coupon.requiredCartTotal)}`;
    }

    this.appliedCouponError = false;
    const sumWithDiscountOfAppliedProducts = itemsToApplyCoupon.reduce((acc: number, curr: CartItem) => {
      const newPrice = roundPrice(
        coupon.type === couponType.Flat
          ? curr.info.price - coupon.discount
          : curr.info.price * ((100 - coupon.discount) / 100),
      );
      return acc + (curr.total * newPrice);
    }, 0);
    const maximumDiscount = oldSumOfAppliedProducts - coupon.maximumDiscount;
    let maximumDiscountExceeded: boolean = false;
    if (coupon.maximumDiscount && sumWithDiscountOfAppliedProducts < maximumDiscount) {
      maximumDiscountExceeded = true;
    }

    // let newSumOfAppliedProducts: number = 0;
    // const newItems = cart.items.map((i: CartItem) => {
    //   if (itemsToApplyCoupon.find((v: CartItem) => v.info._id === i.info._id)) {
    //     const ratio = i.info.price / oldSumOfAppliedProducts;
    //     let newPrice: number = 0;
    //     if (coupon.type === couponType.Flat) {
    //       newPrice = i.info.price - (ratio * coupon.discount);
    //     } else if (maximumDiscountExceeded) {
    //       newPrice = i.info.price - (ratio * coupon.maximumDiscount);
    //     } else {
    //       newPrice = i.info.price * ((100 - coupon.discount) / 100);
    //     }
    //     newPrice = roundPrice(newPrice);
    //     newSumOfAppliedProducts += i.total * newPrice;
    //     return {
    //       ...i,
    //       info: {
    //         ...i.info,
    //         oldPrice: i.info.price,
    //         price: newPrice,
    //       },
    //     };
    //   }

    //   return { ...i };
    // });
    // console.log(oldSumOfAppliedProducts, newSumOfAppliedProducts, maximumDiscountExceeded);
    let appliedCouponPrice: number = 0;
    if (maximumDiscountExceeded) {
      appliedCouponPrice = coupon.maximumDiscount;
    } else if (coupon.type === couponType.Flat) {
      const numOfItems = itemsToApplyCoupon.reduce((acc: number, curr: CartItem) => acc + curr.total, 0);
      appliedCouponPrice = coupon.discount * numOfItems;
    } else {
      appliedCouponPrice = oldSumOfAppliedProducts * (coupon.discount / 100);
    }
    return {
      ...cart,
      appliedCouponPrice: roundPrice(appliedCouponPrice),
    };
  }

  public static resetCoupon(cart: Cart): Cart {
    return {
      ...cart,
      appliedCouponPrice: undefined,
    };
  }

  public static checkAvailability(items: ProductItemPreview | CartItem, cart: Cart): boolean {
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
