import { ProductItemDemo } from '@/interfaces/product/productDemo';
import styles from '@/styles/modules/Product.module.scss';

export default function ProductDemo({ demo, productName }: { demo: ProductItemDemo, productName: string }) {
  if (!demo.video) {
    return null;
  }

  return (
    <section className={styles.productDemo}>
      <h3 className={`${styles.productInfoSubtitle} title`}>Demo video of the {productName}</h3>
      {!!demo.description && <p>{demo.description}</p>}
      <iframe
        className={styles.productVideo}
        width="612"
        height="350"
        src={demo.video}
        title={`Demo video of the ${productName}`}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media;
            gyroscope; picture-in-picture; web-share" allowFullScreen />
    </section>
  );
}
