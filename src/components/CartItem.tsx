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
import Drawer from './Drawer';
import AmountHandler from './AmountHandler';

type CartDrawerProps = {
  cart: Cart;
  removeItems: CallableFunction;
  addItems: CallableFunction;
}

export default function CartItem() {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const { cart, addItems, removeItems } = useCartContext();
  const router = useRouter();

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
          removeItems={removeItems}
        />
      </Drawer>
    </>
  );
}

function DrawerCart({ cart, removeItems, addItems }: CartDrawerProps) {
  const changeProductAmount = (item: ICartItem, amount: number, isDelete?: boolean): Promise<boolean> => {
    const func = (isDelete || amount === 0) ? removeItems : addItems;
    return func(item.info);
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
                onClick={() => removeItems(i.info, true)}
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
