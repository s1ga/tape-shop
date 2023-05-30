/* eslint-disable no-unused-vars */
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/modules/Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faCheck, faChevronUp, faBars, faRectangleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { MouseEvent, ReactNode, useEffect, useState } from 'react';
import useElementOnScreen from '@/hooks/elementOnScreen';
import { useRouter } from 'next/router';
import { ProductTypeCard } from '@/interfaces/productTypeCard';
import CartItem from './CartItem';
import ConditionalWrapper from './ConditionalWrapper';

type ProductsDropdownProps = {
  isOpened: boolean;
  isNotesVisible: boolean;
  types: ProductTypeCard[];
}

type BaseNavListProps = {
  isMobile?: boolean;
  isMobileMenuOpened?: boolean;
  productsClickHandler: (e: MouseEvent) => void;
  isProductsOpened: boolean;
  isNotesVisible: boolean;
  types: ProductTypeCard[];
}

export default function Header({ types = [] }: { types: ProductTypeCard[] }) {
  const [isProductsOpened, setIsProductsOpened] = useState(false);
  const [isMobileProductsOpened, setIsMobileProductsOpened] = useState(false);
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);
  const [containerRef, isNotesVisible] = useElementOnScreen<HTMLDivElement>();
  const router = useRouter();

  const openProducts = (e: MouseEvent) => {
    e.preventDefault();
    setIsProductsOpened((state: boolean) => !state);
  };

  const openMobileProducts = (e: MouseEvent) => {
    e.preventDefault();
    setIsMobileProductsOpened((state: boolean) => !state);
  };

  useEffect(() => {
    const handleRouteChange = () => {
      setIsProductsOpened(false);
      setIsMobileProductsOpened(false);
      setIsMobileMenuOpened(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <>
      <div ref={containerRef} className={`${styles.notes} container`}>
        <ul className={styles.notesList}>
          <li className={styles.notesItem}>
            <FontAwesomeIcon icon={faCheck} className={styles.notesIcon} />
            <span className={styles.notesText} title="Ordered before 3 p.m., shipped the same day">
              Ordered before 3 p.m., shipped the same day
            </span>
          </li>

          <li className={styles.notesItem}>
            <FontAwesomeIcon icon={faCheck} className={styles.notesIcon} />
            <span className={styles.notesText} title="Global delivery">
              Global delivery
            </span>
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
            <FontAwesomeIcon
              className={`${styles.navIcon} ${styles.navBurgerIcon}`}
              icon={isMobileMenuOpened ? faRectangleXmark : faBars}
              onClick={() => setIsMobileMenuOpened((state: boolean) => !state)}
              size="xl"
            />
            <BaseNavList
              productsClickHandler={openProducts}
              isProductsOpened={isProductsOpened}
              types={types}
              isNotesVisible={isNotesVisible}
            />
            <li>
              <CartItem />
            </li>
          </ul>
        </nav>
      </header>

      <ProductsDropdown types={types} isNotesVisible={isNotesVisible} isOpened={isProductsOpened} />

      <BaseNavList
        isMobile={true}
        isMobileMenuOpened={isMobileMenuOpened}
        productsClickHandler={openMobileProducts}
        isProductsOpened={isMobileProductsOpened}
        types={types}
        isNotesVisible={isNotesVisible}
      />
    </>
  );
}

function BaseNavList(
  { isMobile = false, productsClickHandler, isProductsOpened, types, isNotesVisible, isMobileMenuOpened }
    : BaseNavListProps,
) {
  const listItemClassName = isMobile ? `${styles.navMobileItem} container bold` : styles.navItem;
  const wrapper = (children: ReactNode) => (
    <ul className={`
      ${styles.navMobileList} 
      ${isMobileMenuOpened && styles.navMobileListOpen}
      ${!isNotesVisible && styles.navMobileListFixed}
    `}>
      {children}
    </ul>
  );

  return (
    <ConditionalWrapper condition={isMobile} wrapper={wrapper}>
      <li className={!isMobile ? styles.navDesktopItems : ''}>
        <Link className={listItemClassName} href="/webshop">Webshop</Link>
      </li>
      <li className={!isMobile ? styles.navDesktopItems : ''} onClick={productsClickHandler}>
        <button className={listItemClassName}>
          Products
          <FontAwesomeIcon
            className={styles.headerIcon}
            icon={isProductsOpened ? faChevronUp : faChevronDown}
            size="xs" />
        </button>
        {
          isMobile && <ProductsDropdown
            types={types}
            isNotesVisible={isNotesVisible}
            isOpened={isProductsOpened}
          />
        }
      </li>
      <li className={!isMobile ? styles.navDesktopItems : ''}>
        <Link className={listItemClassName} href="/account">My account</Link>
      </li>
    </ConditionalWrapper>
  );
}

function ProductsDropdown({ isOpened, isNotesVisible, types }: ProductsDropdownProps) {
  const cardClassName = types.length > 2 ? 'typeCardGrid3' : `typeCardGrid${types.length}`;

  return (
    <div className={`
      ${styles.headerProducts} 
      ${!isNotesVisible && styles.headerProductsFixed}
      ${isOpened && styles.headerProductsOpen} container
    `}>
      <section className={styles.typeLinks}>
        <h2 className="title">Information</h2>
        {types.map((type: ProductTypeCard) => (
          <Link href={`/info/${type.id}`} key={type.id} className={`${styles.typeLink} bold`}>
            {type.title}
          </Link>
        ))}
      </section>
      <section className={styles.typeCards}>
        <h2 className="title">Products</h2>
        <div className={`${styles.typeCardList} ${styles[cardClassName]}`}>
          {types.map((type: ProductTypeCard) => (
            <Link href={`/types/${type.id}`} key={type.id} className={styles.typeCard}>
              <Image
                className={styles.typeCardImg}
                src={`/images/types/${type.id}.jpg`}
                alt={type.title}
                width={220}
                height={220}
                priority
                decoding="async"
              />
              <div>
                <h3 className={styles.typeCardTitle}>{type.title}</h3>
                <p className={styles.typeCardCaption}>
                  {(type.count || 0) > 1 ? `${type.count} products` : `${type.count} product`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
