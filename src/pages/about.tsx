import Head from 'next/head';
import styles from '@/styles/modules/About.module.scss';
import ProductsCards from '@/components/ProductsCards/ProductsCards';

export default function About() {
  return (
    <>
      <Head><title>About QuiP - QuiPtaping</title></Head>
      <div className="container">
        <div className={styles.about}>
          <section className={styles.aboutItem}>
            <h2 className="title">About QuiP</h2>
            <p className={styles.aboutText}>
              Our passion for smart, functional and high-quality products
              with added value for professionals focuses on the construction,
              maintenance and renovation sectors and for the do-it-yourselfer.
            </p>
            <p className={styles.aboutText}>
              Tape is there for a wide variety of applications.
              Tape is used in almost every industry worldwide.
              Think of building and construction, automotive, medical, maritime, aviation and much more.
              Finding the beginning of the tape, applying it accurately,
              cutting the tape to the right length is time-consuming and requires precision.
              Without tools you need both your hands and also a knife to cut the tape.
              In addition, tape quickly becomes unusable in dusty or humid spaces and drops.
            </p>
          </section>
          <iframe width="500" height="250"
            className={`${styles.video} ${styles.aboutItem}`}
            src="https://www.youtube.com/embed/GRXPl5X2SHk"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media;
          gyroscope; picture-in-picture; web-share" allowFullScreen />
        </div>
        <p className={styles.aboutText}>
          The QuiP tape dispenser offers the solution so that you can always work neatly, quickly and easily.
          The Tape dispenser can be used for different applications
          with every tape and is supplied in the most common width sizes.
        </p>
        <p className={styles.aboutText}>
          Our technology and designs are patented and protected worldwide.
          Quality, speed of work, ease of use and simplicity are core values of the QuiP® brand.
          We focus on functional and high-quality products with added value for
          professionals in the construction, maintenance and renovation sectors.
        </p>
        <p className={styles.aboutText}>
          QuiPtaping is a brand of Mypro BV.
          Our products are marketed worldwide, including in Europe,
          North America, Canada, Mexico, Australia and New Zealand.
        </p>

        <ProductsCards />
      </div>
    </>
  );
}
