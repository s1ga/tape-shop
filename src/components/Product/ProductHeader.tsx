import Thumbnails from '@/components/Thumbnails';
import { useCartContext } from '@/context/cartContext';
import { Category } from '@/interfaces/category';
import { Product } from '@/interfaces/product/product';
import CartService from '@/services/cart.service';
import styles from '@/styles/modules/Product.module.scss';
import Link from 'next/link';
import { useRef } from 'react';
import AmountHandler from '../AmountHandler';

export default function ProductHeader({ product }: { product: Product }) {
  const itemsAmount = useRef<number>(1);
  const { addItems } = useCartContext();

  const onCartAdd = () => {
    if (itemsAmount.current <= 0) {
      return;
    }

    addItems(CartService.prepareItem(product, itemsAmount.current));
  };

  const onChangeAmount = (value: number) => {
    itemsAmount.current = value;
    return Promise.resolve(true);
  };

  return (
    <div className={styles.productHeader}>
      <div className={styles.images}>
        <Thumbnails images={product.images} />
      </div>

      <div className={styles.productHeaderInfoContainer}>
        <h1 className="title">{product.name}</h1>
        <div className={styles.productHeaderInfo}>
          <div className={styles.productHeaderCaption}>
            <div>SKU {product.sku}</div>
            <div className={styles.productHeaderCategories}>
              <span>Categories</span>
              {product.categories.map((c: Category, idx: number) => (
                <Link className={styles.productHeaderCategoryLink} key={c._id} href={`/categories/${c._id}`}>
                  {idx === product.categories.length - 1 ? c.name : `${c.name},`}
                </Link>
              ))}
            </div>
          </div>
          <div className={`${styles.productHeaderPrice} bold`}>$ {product.price}</div>
          {(product.availability ?? 0) > 0
            && <div><span className="bold">Availability: </span>{product.availability} in stock</div>}
          {typeof product.availability === 'number' && product.availability === 0
            && <div><span className="bold">Availability: </span>Out of stock</div>}
          <div className={styles.productHeaderActions}>
            <AmountHandler
              availability={product.availability}
              onChange={onChangeAmount}
            />
            <button className={styles.productHeaderBtn} onClick={onCartAdd}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
