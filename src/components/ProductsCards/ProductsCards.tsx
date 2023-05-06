import styles from '@/styles/modules/ProductsCards.module.scss';
import Link from 'next/link';
import { Card, getCards } from './cards';

export default function ProductsCards({ isHomePage = false }: { isHomePage?: boolean }) {
  const cards: Card[] = getCards(isHomePage);

  return (
    <section className={styles.aboutProducts}>
      <h2 className={`${isHomePage ? styles.productsTitle : ''} title centered`}>Our products</h2>
      <div className={styles.products}>
        {cards.map((card: Card) => (
          <Link key={card.id} href={card.link} className={styles.productCardContainer}>
            <div className={`${styles.productImg} ${styles[card.className]}`}></div>
            <div className={styles.productCard}>
              <h3 className={styles.productTitle}>
                {card.title}
              </h3>
              <p>{card.text}</p>
            </div>
          </Link>
        ))}

        {/* TODO: For test purposes. Choose one of the styles and uncomment code in cards.ts  */}
        <div className={`${styles.productCardContainer} ${styles.noShadow}`}>
          <div className={`${styles.productImg} ${styles.productImgTest} ${styles.maskingtapeImg}`}>
            <div className={styles.overlay}></div>
          </div>
          <div className={styles.productCard}>
            <h3 className={styles.productTitle}>Masking tape</h3>
            <p>
              Sharp painting lines and no residue are the result
              when removing the QuiP maskingtape after the paint is dry.
            </p>
            <Link href="/" className={styles.productBtn}>Read more</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
