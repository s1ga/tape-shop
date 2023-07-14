import { faBasketShopping, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '@/styles/modules/CartItem.module.scss';
import { useEffect, useState } from 'react';
import { useCartContext } from '@/context/cartContext';
import { Cart, CartItem as ICartItem } from '@/interfaces/cart';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { formatPrice, roundPrice } from '@/utils/helpers';
import { AppliedCoupon } from '@/interfaces/coupon';
import LinkService from '@/services/link.service';
import httpMethods from '@/constants/httpMethods';
import { ServerData } from '@/interfaces/serverData';
import ToastService from '@/services/toast.service';
import CouponsService from '@/services/coupons.service';
import UserService from '@/services/user.service';
import Drawer from './Drawer';
import AmountHandler from './AmountHandler';

type CartDrawerProps = {
  cart: Cart;
  removeItem: CallableFunction;
  addItems: CallableFunction;
  removeAllItem: CallableFunction;
}

const COUPON_TOAST_SUCCESS = 'initial-coupon-success';
const COUPON_TOAST_ERROR = 'initial-coupon-error';

export default function CartItem() {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const { cart, addItems, removeItem, removeAllItem, applyCoupon, resetCoupon } = useCartContext();
  const router = useRouter();

  useEffect(() => {
    const coupon = CouponsService.getFromStorage();
    if (coupon?.code) {
      // setIsLoading(true);
      fetch(LinkService.apiApplyCouponLink(), {
        method: httpMethods.post,
        body: JSON.stringify({ code: coupon.code }),
        headers: {
          'Content-Type': 'Application/json',
          Authorization: UserService.getUserToken(),
        },
      })
        .then(async (res: Response) => {
          const { data }: ServerData<AppliedCoupon | string> = await res.json();
          if (!res.ok) {
            throw new Error(data as string);
          }

          const result = applyCoupon(data as AppliedCoupon);
          // if (typeof result === 'string') {
          //   throw new Error(result);
          // } else
          if (result) {
            ToastService.success(
              `${(data as AppliedCoupon).name} has been applied successfully`,
              { toastId: COUPON_TOAST_SUCCESS },
            );
          }
        })
        .catch((err: Error) => {
          resetCoupon();
          ToastService.error(err.message, {
            toastId: COUPON_TOAST_ERROR,
          });
        });
      // .finally(() => setIsLoading(false));
    }
  }, [applyCoupon, resetCoupon]);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsDrawerOpened(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <>
      <button className={styles.cart} onClick={() => setIsDrawerOpened(true)}>
        <span className={styles.cartTotal}>$ {formatPrice(cart.totalPrice)}</span>
        <span className={styles.cartBasket}>
          <FontAwesomeIcon className={styles.cartIcon} icon={faBasketShopping} size="xs" />
          <span className={styles.cartAmount}>{cart.totalAmount}</span>
        </span>
      </button>

      <Drawer isOpened={isDrawerOpened} setIsOpened={setIsDrawerOpened}>
        <DrawerCart
          cart={cart}
          addItems={addItems}
          removeItem={removeItem}
          removeAllItem={removeAllItem}
        />
      </Drawer>
    </>
  );
}

function DrawerCart({ cart, removeItem, addItems, removeAllItem }: CartDrawerProps) {
  const changeProductAmount = (item: ICartItem, amount: number, isDelete?: boolean): void => {
    if (isDelete || amount === 0) {
      removeItem(item.info);
    } else {
      addItems(item.info);
    }
  };

  if (cart.totalAmount < 1) {
    return <p className="bold">No items in the cart.</p>;
  }

  return (
    <div className={styles.cartDrawer}>
      <div className={styles.cartDrawerList}>
        {cart.items.map((i: ICartItem) => (
          <section key={i.info._id} className={styles.cartDrawerCard}>
            <Link href={`/products/${i.info._id}`}>
              <Image
                className={styles.cartDrawerCardImg}
                src={i.info.images[0]}
                alt={i.info.name}
                width={120}
                height={120}
                decoding="async"
                loading="lazy"
              />
              <h3 className={`${styles.cartDrawerCardTitle} title`}>{i.info.name}</h3>
            </Link>
            <div className={styles.cartDrawerCardActions}>
              <AmountHandler
                availability={i.info.availability}
                miniView={true}
                readonly={true}
                initialValue={i.total}
                onChange={
                  (amount: number, isDelete?: boolean) => changeProductAmount(i, amount, isDelete)
                }
              />
              <p>$ {formatPrice(roundPrice(i.info.price * i.total))}</p>
              <FontAwesomeIcon
                className={styles.cartDrawerCardIcon}
                onClick={() => removeAllItem(i.info)}
                icon={faCircleXmark} size="lg"
              />
            </div>
          </section>
        ))}
      </div>

      <div className={styles.cartDrawerTotal}>
        <span className="bold">Subtotal:</span> $ {formatPrice(roundPrice(cart.totalPrice))}
      </div>

      <div className={styles.cartDrawerActions}>
        <Link href="/cart" className={styles.cardDrawerBtn}>
          View cart
        </Link>
        <Link href="/checkout" className={styles.cardDrawerBtn}>
          Checkout
        </Link>
      </div>
    </div>
  );
}
