import Head from 'next/head';
import styles from '@/styles/modules/Home.module.scss';
import Link from 'next/link';
import ProductsCards from '@/components/ProductsCards/ProductsCards';
import { faCheck, faClock, faEye, faHeart, faThumbsUp, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TypeService from '@/services/type.service';
import { Type } from '@/interfaces/type';
import dbConnect from '@/utils/db';

export async function getServerSideProps() {
  await dbConnect();
  return {
    props: {
      types: JSON.parse(JSON.stringify(await TypeService.findAll())),
    },
  };
}

export default function Home({ types }: { types: Type[] }) {
  return (
    <>
      <Head>
        <title>QuiPtaping</title>
        <meta name="description" content="QuiPtaping have the passion for smart,
        functional and high-quality products with added value for professionals focuses,
        do-it-yourselfer on the construction." />
      </Head>
      <div className="container">
        <div className={styles.intro}>
          <section className={styles.introBlock}>
            <h1 className={`${styles.introTitle} title`}>QuiP tape dispensers, speed and precision</h1>
            <p className={styles.introText}>
              The QuiP tape dispenser is a time saver for your intensive job preparation.
              Accurate tape appliance with straight cutting mechanism which is extremely useful in corners.
            </p>
            <p className={styles.introText}>Repeatable.</p>
            <p className={styles.introText}>
              Available in different bandwidths. All tape brands fit in the dispenser.
            </p>
            <Link href="/webshop" className={styles.introBtn}>Order Now</Link>
          </section>
          <iframe
            className={`${styles.video} ${styles.introBlock}`}
            width="630" height="350"
            src="https://www.youtube.com/embed/XR4TYaGBWt0
            ?autoplay=1&loop=1&controls=0&mute=1&rel=0&showinfo=0&playlist=XR4TYaGBWt0"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media;
            gyroscope; picture-in-picture; web-share" allowFullScreen />
        </div>

        <ProductsCards isHomePage={true} types={types} />
      </div>

      <section className={`${styles.featuresContainer} container`}>
        <h2 className={`${styles.featuresTitle} title`}>Why QuiPtaping?</h2>
        <p className={styles.featuresText}>
          Value can be measured in many ways — money, time, reputation, quality,
          environmental stewardship and productivity.
          In all of these ways, both qualitative and quantitative, QuiPtaping brings value to every project.
        </p>

        <div className={styles.features}>
          <section className={styles.feature}>
            <FontAwesomeIcon className={styles.featureIcon} icon={faClock} />
            <h3 className={`${styles.featureTitle} title`}>Time</h3>
            <p>
              In business, labour is far the most important cost factor.
              QuiPtaping products have been carefully designed to help you
              to get the job done faster and more precise!
            </p>
          </section>

          <section className={styles.feature}>
            <FontAwesomeIcon className={styles.featureIcon} icon={faThumbsUp} />
            <h3 className={`${styles.featureTitle} title`}>Functional</h3>
            <p>
              The ergonomic design of each QuiP taping dispensers adds to the comfort of the tradesman.
              Our dispenser is easy to use and safe to handle.
            </p>
          </section>

          <section className={styles.feature}>
            <FontAwesomeIcon className={styles.featureIcon} icon={faEye} />
            <h3 className={`${styles.featureTitle} title`}>Precision</h3>
            <p>
              Your paintwork has never been so tight thanks to the QuiPtaping products.
              Easy and precise masking!
            </p>
          </section>

          <section className={styles.feature}>
            <FontAwesomeIcon className={styles.featureIcon} icon={faCheck} />
            <h3 className={`${styles.featureTitle} title`}>Quality</h3>
            <p>
              We carefully measure and monitor our production quality
              to ensure that the dispensers have the required precision.
            </p>
          </section>

          <section className={styles.feature}>
            <FontAwesomeIcon className={styles.featureIcon} icon={faHeart} />
            <h3 className={`${styles.featureTitle} title`}>Safety</h3>
            <p>
              The ergonomic design of QuiP taping dispensers helps with user comfort.
              Easy and safe to use.
            </p>
          </section>

          <section className={styles.feature}>
            <FontAwesomeIcon className={styles.featureIcon} icon={faTrophy} />
            <h3 className={`${styles.featureTitle} title`}>Professionalism</h3>
            <p>
              Our tape dispensers help to apply tape faster and more accurately,
              resulting in a better result.
            </p>
          </section>
        </div>
      </section>

      <div className={`${styles.links} container`}>
        <Link href="/user-instructions" className={`${styles.link} ${styles.instructions}`}>
          <h2 className={`${styles.linkTitle} title`}>User instructions</h2>
          <div className={styles.overlay}></div>
        </Link>

        <Link href="/frequently-asked-questions" className={`${styles.link} ${styles.fqa}`}>
          <h2 className={`${styles.linkTitle} title`}>Frequently asked questions</h2>
          <div className={styles.overlay}></div>
        </Link>

        <Link href="/advises" className={`${styles.link} ${styles.tips}`}>
          <h2 className={`${styles.linkTitle} title`}>Painting tips</h2>
          <div className={styles.overlay}></div>
        </Link>
      </div>
    </>
  );
}
