import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/modules/Footer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { ReactNode, useEffect, useState } from 'react';
import ScreenUtils from '@/utils/screen';
import ConditionalWrapper from './ConditionalWrapper';

export default function Footer() {
  const [isTablet, setIsTablet] = useState(false);
  const wrapperFunction = (children: ReactNode) => (
    <div className={styles.footerLinksContainer}>{children}</div>
  );
  const handleResize = () => setIsTablet(ScreenUtils.isTablet());

  useEffect(() => {
    setIsTablet(ScreenUtils.isTablet());
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerContainer} container`}>
        <div className={styles.footerItem}>
          <Link href="/">
            <Image
              className={styles.footerLogo}
              src="/images/logo.png"
              alt="QuiPtaping logo"
              width={120}
              height={42}
              loading="lazy"
              decoding="async"
            />
          </Link>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Availability:</h3>
            <p className={styles.sectionText}>We are available on weekdays as follows:</p>
            <p className={styles.sectionText}>Monday – Thursday: 8.30 am – 5.00 pm</p>
            <p className={styles.sectionText}>Friday: 8.30 am – 3.00 am</p>
            <ul className={styles.socialLinks}>
              <li>
                <Link className={styles.socialLink}
                  target="_blank"
                  href="https://www.facebook.com/Quiptaping">
                  <FontAwesomeIcon icon={faFacebookF} size="xl" />
                </Link>
              </li>
              <li>
                <Link className={styles.socialLink}
                  target="_blank"
                  href="https://www.youtube.com/channel/UCkbb-oAlw9vax9_1w7l3-2Q">
                  <FontAwesomeIcon icon={faYoutube} size="xl" />
                </Link>
              </li>
              <li>
                <Link className={styles.socialLink}
                  href="https://www.instagram.com/quiptaping"
                  target='_blank'>
                  <FontAwesomeIcon icon={faInstagram} size="xl" />
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <ConditionalWrapper condition={isTablet} wrapper={wrapperFunction}>
          <div className={styles.footerItem}>
            <section>
              <h3 className={styles.sectionTitle}>Usefull pages</h3>
              <ul className={styles.sectionList}>
                <li>
                  <Link className={styles.sectionLink} href="/usage">Usage</Link>
                </li>
                <li>
                  <Link className={styles.sectionLink} href="/advises">Painting tips</Link>
                </li>
                <li>
                  <Link className={styles.sectionLink} href="/user-instructions">User instructions</Link>
                </li>
                <li>
                  <Link className={styles.sectionLink} href="/frequently-asked-questions">
                    Frequently Asked Questions
                  </Link>
                </li>
              </ul>
            </section>

            <section className={styles.contact}>
              <h3 className={styles.sectionTitle}>Contact</h3>
              <ul className={styles.sectionList}>
                <li>
                  <a className={[styles.contactLink, styles.sectionLink].join(' ')}
                    href="tel:+31 6 52088599">
                    <FontAwesomeIcon className={styles.contactIcon}
                      icon={faPhone} />
                    <span>+31 6 52088599</span>
                  </a>
                </li>
                <li>
                  <a className={[styles.contactLink, styles.sectionLink].join(' ')}
                    href="mailto:info@quiptaping.com">
                    <FontAwesomeIcon className={styles.contactIcon}
                      icon={faEnvelope} />
                    <span>info@quiptaping.com</span>
                  </a>
                </li>
              </ul>
            </section>
          </div>

          <section className={styles.footerItem}>
            <h3 className={styles.sectionTitle}>Other Links</h3>
            <ul className={styles.sectionList}>
              <li><Link className={styles.sectionLink} href="/terms-conditions">Terms & Conditions</Link></li>
              <li>
                <Link className={styles.sectionLink} href="/shipping-return-policy">
                  Shipping & Return policy
                </Link>
              </li>
              <li><Link className={styles.sectionLink} href="/privacy-policy">Privacy policy</Link></li>
              <li><Link className={styles.sectionLink} href="/disclaimer">Disclaimer</Link></li>
              <li><Link className={styles.sectionLink} href="/contact">Contact Form</Link></li>
              <li><Link className={styles.sectionLink} href="/about">About QuiP</Link></li>
            </ul>
          </section>
        </ConditionalWrapper>
      </div>

      <div className={`container ${styles.copyright}`}>
        <div>&copy; All rights reserved</div>
        <div>
          Created by&nbsp;
          <Link className={styles.copyrightLink}
            target="_blank"
            href="https://www.linkedin.com/in/siarhei-kharlanau">
            Siarhei Kharlanau
          </Link>
        </div>
      </div>
    </footer>
  );
}
