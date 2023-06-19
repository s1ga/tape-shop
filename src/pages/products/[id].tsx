import dynamic from 'next/dynamic';
import Head from 'next/head';
import styles from '@/styles/modules/Product.module.scss';
import Tabs from '@/components/Tabs';
import { Tab } from '@/interfaces/tabs';
import { Product, ProductItemPreview } from '@/interfaces/product/product';
import ProductInfo from '@/components/Product/ProductInfo/ProductInfo';
import ProductsList from '@/components/ProductsList/ProductsList';
import { Review } from '@/interfaces/review';
import ProductAdditionalInfo from '@/components/Product/ProductAdditionalInfo';
import ProductService from '@/services/product.service';
import dbConnect from '@/utils/db';
import ReviewService from '@/services/review.service';
import { isValidObjectId } from 'mongoose';
import ProductHeader from '../../components/Product/ProductHeader';

const Reviews = dynamic(
  () => import('@/components/Product/Reviews/Reviews'),
  { ssr: false },
);

export const getServerSideProps = async ({ params }: { params: { id: string } }) => {
  await dbConnect();

  if (!isValidObjectId(params.id)) {
    return {
      notFound: true,
    };
  }
  let product = await ProductService.getById(params.id);
  if (!product) {
    return {
      notFound: true,
    };
  }
  product = ProductService.toFullProduct(product);
  const relatedProducts = await Promise.all(
    product.related.map(ProductService.getById),
  );
  const reviews = ReviewService.fromServer(
    await ReviewService.getByProductId(product._id),
  );

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      reviews: JSON.parse(JSON.stringify(reviews)),
      relatedProducts: JSON.parse(JSON.stringify(ProductService.toPreview(relatedProducts))),
    },
  };
};

export default function ProductPage(
  { product, relatedProducts, reviews }:
    { product: Product, relatedProducts: ProductItemPreview[], reviews: Review[] },
) {
  const tabs: Tab[] = generateTabs(product, reviews);

  return (
    <>
      <Head>
        <title>{`${product.name} - QuiPtaping`}</title>
      </Head>

      <div className={`${styles.productContainer} container`}>
        <ProductHeader product={product} />

        <div className={styles.productMain}>
          <div className={styles.productContent}>
            <Tabs tabs={tabs} />
          </div>

          {!!relatedProducts.length
            && <aside className={styles.productRelated}>
              <h2 className={`${styles.productInfoTitle} title`}>Related products</h2>
              <ProductsList products={relatedProducts} isCentered={false} isMiniView={true} />
            </aside>
          }
        </div>
      </div>
    </>
  );
}

function generateTabs(product: Product, reviews: Review[]) {
  const approved = reviews.filter((r: Review) => r.isApproved && r.isChecked);
  const tabs: Tab[] = [];

  tabs.push({
    id: 'descriptionTab',
    text: 'Description',
    content: () => <ProductInfo product={product} />,
  });

  if (product.additionalInformation?.length) {
    tabs.push({
      id: 'additionalInfoTab',
      text: 'Additional information',
      content: () => <ProductAdditionalInfo info={product.additionalInformation!} />,
    });
  }

  tabs.push({
    id: 'reviewsTab',
    text: `Reviews (${approved.length})`,
    content: () => <Reviews
      fetchedReviews={reviews}
      productId={product._id}
      productName={product.name}
    />,
  });

  return tabs;
}
