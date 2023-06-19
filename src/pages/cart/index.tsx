import Head from 'next/head';
import styles from '@/styles/modules/Cart.module.scss';
import { useCartContext } from '@/context/cartContext';
import { CartItem, Cart as ICart } from '@/interfaces/cart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';
import AmountHandler from '@/components/AmountHandler';
import { formatPrice, roundPrice } from '@/utils/helpers';
import { useRef } from 'react';
import ToastService from '@/services/toast.service';

type CartTableProps = {
  cart: ICart;
  removeAllItem: CallableFunction;
  changeProductAmount: CallableFunction;
  onCouponApplied: CallableFunction;
}

// TODO: add responsive design
export default function Cart() {
  const { cart, removeAllItem, removeItem, addItems } = useCartContext();

  const changeProductAmount = (item: CartItem, amount: number, isDelete?: boolean): void => {
    if (isDelete || amount === 0) {
      removeItem(item.info);
    } else {
      addItems(item.info);
    }
  };

  const applyCoupon = (coupon: string) => {
    console.log(`Coupon applied: ${coupon}`);
    ToastService.error('Applied coupon does not exist');
  };

  return (
    <>
      <Head>
        <title>Cart - QuiPtaping</title>
        <meta name="dc.title" content="Cart - QuiPtaping" />
        <meta name="dc.description" content="Cart" />
        <meta name="dc.relation" content={`${process.env.NEXT_PUBLIC_DOMAIN}/cart`} />
        <meta name="robots" content="follow, noindex" />
        <meta name="og:url" content={`${process.env.NEXT_PUBLIC_DOMAIN}/cart`} />
        <meta property="og:title" content="Cart - QuiPtaping" />
        <meta property="og:description" content="Cart" />
        <meta name="twitter:title" content="Cart - QuiPtaping" />
        <meta name="twitter:description" content="Cart" />
      </Head>

      <section className={`${styles.cart} container`}>
        <h1 className="title centered">Cart</h1>

        <CartTable
          cart={cart}
          removeAllItem={removeAllItem}
          changeProductAmount={changeProductAmount}
          onCouponApplied={applyCoupon}
        />
        <CartTotal />
      </section>
    </>
  );
}

function CartTable({ cart, removeAllItem, changeProductAmount, onCouponApplied }: CartTableProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <table className={styles.cartTable}>
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {cart.items.map((c: CartItem) => (
          <tr key={c.info._id}>
            <td>
              <FontAwesomeIcon
                className={styles.cartTableIcon}
                onClick={() => removeAllItem(c.info)}
                icon={faCircleXmark} size="xl"
              />
            </td>
            <td>
              <Link href={`/products/${c.info._id}`}>
                <Image
                  className={styles.cartTableImg}
                  src={c.info.images[0]}
                  alt={c.info.name}
                  width={85}
                  height={85}
                  decoding="async"
                  loading="lazy"
                />
              </Link>
            </td>
            <td>
              <Link className={`${styles.cartTableName} bold`} href={`/products/${c.info._id}`}>
                {c.info.name}
              </Link>
            </td>
            <td>
              $ {c.info.price}
            </td>
            <td>
              <AmountHandler
                availability={c.info.availability}
                initialValue={c.total}
                readonly={true}
                onChange={
                  (amount: number, isDelete?: boolean) => changeProductAmount(c, amount, isDelete)
                }
              />
            </td>
            <td>
              $ {formatPrice(roundPrice(c.total * c.info.price))}
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={6}>
            <div className={styles.cartTableAction}>
              <input
                className={styles.cartTableInput}
                type="text"
                ref={inputRef}
                placeholder="Coupon code"
                required
              />
              <button
                className={styles.cartTableBtn}
                onClick={() => onCouponApplied(inputRef.current?.value)}
              >
                Apply coupon
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function CartTotal() {
  return (
    <div>
      <div>
        <h2>Cart totals</h2>
        <table></table>
        <div>
          <button className={''}>
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
}
