import { ProductItemPreview } from '@/interfaces/product/product';
import styles from '@/styles/modules/Type.module.scss';
import { useState } from 'react';
import Sorting from '@/components/ProductsSorting/ProductsSorting';
import Head from 'next/head';
import ProductsList from './ProductsList/ProductsList';

export default function CategoryList(
  { products, categoryName }: { products: ProductItemPreview[], categoryName: string },
) {
  const [sortedProducts, setSortedProducts] = useState<ProductItemPreview[]>(products);

  const onSorting = (result: ProductItemPreview[]) => {
    setSortedProducts([...result]);
  };

  return (
    <>
      <Head>
        <title>{`${categoryName} - QuiPtaping`}</title>
      </Head>
      <section className="container">
        <h1 className={`${styles.typeTitle} title centered`}>
          {categoryName}
        </h1>
        {!!sortedProducts.length && <div className={styles.sortingBlock}>
          <div className={styles.sortingResult}>
            Showing {
              products.length > 1
                ? `all ${products.length} results`
                : 'the single result'
            }
          </div>
          {sortedProducts.length > 1 && <Sorting value={products} onChange={onSorting} />}
        </div>}
        <ProductsList isCentered={false} categoryName={categoryName} products={sortedProducts} />
      </section>
    </>
  );
}
