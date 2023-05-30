import Head from 'next/head';
import styles from '@/styles/modules/Webshop.module.scss';
import { useState } from 'react';
import Sorting from '@/components/ProductsSorting/ProductsSorting';
import ProductsList from '@/components/ProductsList/ProductsList';
import ProductService from '@/services/product.service';
import { Product, ProductItemPreview } from '@/interfaces/product/product';
import ReviewService from '@/services/review.service';
import dbConnect from '@/utils/db';

export const getServerSideProps = async () => {
  await dbConnect();

  const products = ProductService.toPreview(
    await ProductService.getAll() as Product[],
  );
  const ratedProducts = await ReviewService.mapRatingsToProducts(products as ProductItemPreview[]);

  return {
    props: {
      products: JSON.parse(JSON.stringify(ratedProducts)),
    },
  };
};

export default function Webshop({ products }: { products: ProductItemPreview[] }) {
  const [sortedProducts, setSortedProducts] = useState<ProductItemPreview[]>(products);

  const onSorting = (result: Product[]) => {
    setSortedProducts([...result]);
  };

  return (
    <>
      <Head>
        <title>Shop - QuiPtaping</title>
      </Head>
      <section className="container">
        <h2 className={`${styles.productsTitle} title centered`}>Our products</h2>
        {sortedProducts.length > 1
          && <div className={styles.productsSorting}>
            <Sorting value={sortedProducts} onChange={onSorting} />
          </div>
        }
        <ProductsList products={sortedProducts} />
      </section>
    </>
  );
}
