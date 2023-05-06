import '@/styles/globals.scss';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <div className="content">
        <Header />
        <main className="main">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>

      <style jsx>{`
          .content {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
          
          .main {
            flex: 1;
          }
        `}</style>
    </>
  );
}
