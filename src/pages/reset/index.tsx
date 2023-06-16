import Head from 'next/head';
import styles from '@/styles/modules/Account.module.scss';
import httpMethods from '@/constants/httpMethods';
import getDomain from '@/utils/getDomain';
import { FormEvent, useState } from 'react';
import { ServerData } from '@/interfaces/serverData';
import ToastService from '@/services/toast.service';
import Loader from '@/components/Loader';

const RESET_URL = `${getDomain()}/api/user/reset`;

export default function Reset() {
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const email = form.get('email')?.toString() || '';
    try {
      setLoading(true);
      const res = await fetch(RESET_URL, {
        method: httpMethods.post,
        body: JSON.stringify({ email }),
        headers: { 'Content-type': 'Application/json' },
      });
      const { data }: ServerData<string> = await res.json();

      if (!res.ok) {
        throw new Error(data);
      }

      ToastService.success(data, { autoClose: 4000 });
    } catch (error: any) {
      console.error(error);
      ToastService.error(error.message as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset password - QuiPtaping</title>
      </Head>
      <div className={`${styles.wrapper} container`}>
        {loading && <Loader />}
        {!loading
          && <>
            <p>Lost your password?</p>
            <p className={styles.indentL}>
              Please enter email address and
              you will receive a link to create a new password via email.
            </p>

            <form action={RESET_URL} method={httpMethods.post} className={styles.form} onSubmit={onSubmit}>
              <div className={styles.formItem}>
                <label className={styles.formLabel} htmlFor="email">Email address</label>
                <input
                  className={styles.formInput}
                  type="email" inputMode="email" id="email"
                  name="email" required
                />
              </div>
              <button className={styles.formBtn} type="submit">
                Reset password
              </button>
            </form>
          </>
        }
      </div>
    </>
  );
}
