/* eslint-disable no-unused-vars */
import httpMethods from '@/constants/httpMethods';
import Link from 'next/link';
import { FormEvent, useEffect, useRef, useState } from 'react';
import styles from '@/styles/modules/Account.module.scss';
import getDomain from '@/utils/getDomain';
import { ServerData } from '@/interfaces/serverData';
import LocalStorageService from '@/services/storage.service';
import storageKeys from '@/constants/storageKeys';
import ToastService from '@/services/toast.service';
import { useRouter } from 'next/router';
import Loader from './Loader';

const LOGIN_URL = `${getDomain()}/api/user/login`;
const VERIFY_URL = `${getDomain()}/api/user/verify`;

export default function Login({ onLogin }: { onLogin: CallableFunction }) {
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useRef<number | string>();
  const router = useRouter();

  useEffect(() => {
    const { hash } = router.query;
    if (!hash) {
      return;
    }

    setLoading(true);
    fetch(`${VERIFY_URL}?hash=${hash}`)
      .then(async (res: Response) => {
        const { data }: ServerData<string> = await res.json();
        if (!res.ok) {
          throw new Error(data as string);
        }
        if (!ToastService.isActive(toast.current)) {
          toast.current = ToastService.success(data, { autoClose: 5000 });
        }
      })
      .catch((error: any) => {
        console.error(error);
        if (!ToastService.isActive(toast.current)) {
          toast.current = ToastService.error(error.message as string, { autoClose: 5000 });
        }
      })
      .finally(() => {
        setLoading(false);
        router.replace(router.pathname, undefined, { shallow: true });
      });
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData(e.target as HTMLFormElement);
      const res = await fetch(LOGIN_URL, {
        method: httpMethods.post,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email')?.toString() || '',
          password: form.get('password')?.toString() || '',
        }),
      });
      const { data }: ServerData<string> = await res.json();

      if (!res.ok) {
        throw new Error(data as string);
      }

      LocalStorageService.set<string>(storageKeys.Auth, data);
      onLogin();
    } catch (error: any) {
      console.error(error);
      ToastService.error(error.message as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.wrapper}>
      <h1 className="title">Login</h1>
      {loading && <Loader />}
      {!loading
        && <div className={styles.formWrapper}>
          <form action={LOGIN_URL} method={httpMethods.post} className={styles.form} onSubmit={onSubmit}>
            <div className={styles.formItem}>
              <label className={styles.formLabel} htmlFor="email">Email address</label>
              <input
                className={styles.formInput}
                type="email" inputMode="email" id="email"
                name="email" required
              />
            </div>
            <div className={styles.formItem}>
              <label className={styles.formLabel} htmlFor="password">Password</label>
              <input
                className={styles.formInput}
                type="password" inputMode="text" id="password"
                name="password" autoComplete="true" required
              />
            </div>
            <button className={styles.formBtn} type="submit">
              Log in
            </button>
          </form>
          <Link className={`${styles.link} ${styles.indentSm}`} href="/reset">
            Lost your password?
          </Link>
          <div>
            Don&lsquo;t have an account?&nbsp;
            <Link className={styles.link} href="/register">Sign up</Link>
          </div>
        </div>
      }
    </section>
  );
}
