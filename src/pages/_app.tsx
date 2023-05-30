import '@/styles/globals.scss';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { CartProvider } from '@/context/cartContext';
import { ProductTypeCard } from '@/interfaces/productTypeCard';
import { useEffect, useRef, useState } from 'react';
import { Type } from '@/interfaces/type';
import { ServerData } from '@/interfaces/serverData';
import Loader from '@/components/Loader';
import getDomain from '@/utils/getDomain';

const DOMAIN = getDomain();

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(false);
  const productTypes = useRef<ProductTypeCard[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${DOMAIN}/api/types`)
      .then((res: Response) => res.json())
      .then((data: ServerData<Type[]>) => {
        const types = data.data;
        const cards: ProductTypeCard[] = [];
        types.forEach(async (t: Type) => {
          const products: ServerData<unknown[]> = await (
            await fetch(`${DOMAIN}/api/types/${t._id}/products`)
          ).json();
          cards.push({
            id: t.id,
            title: t.name,
            count: products.data.length,
          });
        });
        productTypes.current = cards;
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <CartProvider>
        <div className="content">
          {isLoading && <Loader />}
          {!isLoading
            && <>
              <Header types={productTypes.current} />
              <main className="main">
                <Component {...pageProps} />
              </main>
              <Footer />
            </>
          }
        </div>

        <style jsx>{`
          .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100vh;
          }
          
          .main {
            flex: 1;
          }
        `}</style>
      </CartProvider>
    </>
  );
}
