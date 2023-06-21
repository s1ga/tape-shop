import Head from 'next/head';
import styles from '@/styles/modules/Webshop.module.scss';
import { useState } from 'react';
import Sorting from '@/components/ProductsSorting/ProductsSorting';
import ProductsList from '@/components/ProductsList/ProductsList';
import ProductService from '@/services/product.service';
import { Product, ProductItemPreview } from '@/interfaces/product/product';
import dbConnect from '@/utils/db';

export const getServerSideProps = async () => {
  await dbConnect();

  const products = ProductService.toPreview(
    await ProductService.getAll() as Product[],
  );

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
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
        <meta
          name="description"
          content="Our products"
        />
        <meta name="dc.title" content="Shop - QuiPtaping" />
        <meta
          name="dc.description"
          content="Our products"
        />
        <meta name="dc.relation" content={`${process.env.NEXT_PUBLIC_DOMAIN}/webshop`} />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/webshop`} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_DOMAIN}/webshop`} />
        <meta property="og:title" content="Shop - QuiPtaping" />
        <meta
          property="og:description"
          content="Our products"
        />
        <meta name="twitter:title" content="Shop - QuiPtaping" />
        <meta
          name="twitter:description"
          content="Our products"
        />
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
