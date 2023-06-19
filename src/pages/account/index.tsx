import Account from '@/components/Account';
import Login from '@/components/Login';
import storageKeys from '@/constants/storageKeys';
import LocalStorageService from '@/services/storage.service';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function AccountPage() {
  const [hasToken, setHasToken] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === storageKeys.Auth) {
        setHasToken(!!JSON.parse(e.newValue || JSON.stringify('')));
      }
    };
    window.addEventListener('storage', handler);
    setHasToken(!!(LocalStorageService.get<string>(storageKeys.Auth) || ''));

    return () => {
      window.removeEventListener('storage', handler);
    };
  }, []);

  return (
    <>
      <Head>
        <title>My account - QuiPtaping</title>
        <meta name="dc.title" content="My account - QuiPtaping" />
        <meta name="dc.relation" content={`${process.env.NEXT_PUBLIC_DOMAIN}/account`} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_DOMAIN}/account`} />
        <meta property="og:title" content="My account - QuiPtaping" />
        <meta name="twitter:title" content="My account - QuiPtaping" />
        <meta name="robots" content="follow, noindex" />
      </Head>
      <div className="container">
        {hasToken && <Account onLogout={() => setHasToken(false)} />}
        {!hasToken && <Login onLogin={() => setHasToken(true)} />}
      </div>
    </>
  );
}
