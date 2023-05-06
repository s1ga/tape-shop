import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/modules/Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  return (
    <>
      <div className={`${styles.notes} container`}>
        <ul className={styles.notesList}>
          <li className={styles.notesItem}>
            <FontAwesomeIcon icon={faCheck} className={styles.notesIcon} />
            <span>Ordered before 3 p.m., shipped the same day</span>
          </li>

          <li className={styles.notesItem}>
            <FontAwesomeIcon icon={faCheck} className={styles.notesIcon} />
            <span>Global delivery</span>
          </li>
        </ul>
      </div>

      <header className={`${styles.header} container`}>
        <Link className={styles.headerLogo} href="/">
          <Image
            className={styles.headerImg}
            src="/images/logo.png"
            alt="QuiPtaping logo"
            width={200}
            height={70}
            priority
          />
        </Link>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <Link className={styles.navItem} href="/">Webshop</Link>
            </li>
            <li>
              <Link className={styles.navItem} href="/">Products</Link>
            </li>
            <li>
              <Link className={styles.navItem} href="/">My account</Link>
            </li>
            <li>
              <Link className={styles.navItem} href="/">Cart</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
