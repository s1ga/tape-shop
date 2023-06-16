import { useEffect, useState } from 'react';
import getDomain from '@/utils/getDomain';
import LocalStorageService from '@/services/storage.service';
import storageKeys from '@/constants/storageKeys';
import ToastService from '@/services/toast.service';
import { User } from '@/interfaces/user';
import { ServerData } from '@/interfaces/serverData';
import styles from '@/styles/modules/Account.module.scss';
import Loader from './Loader';

const USER_URL = `${getDomain()}/api/user`;

export default function Account({ onLogout }: { onLogout: CallableFunction }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    setLoading(true);
    fetch(USER_URL, {
      headers: {
        Authorization: LocalStorageService.get<string>(storageKeys.Auth) || '',
      },
    })
      .then(async (res: Response) => {
        const { data }: ServerData<User | string> = await res.json();
        if (!res.ok) {
          throw new Error(data as string);
        }
        setUser(data as User);
      })
      .catch((error: any) => {
        console.error(error);
        ToastService.error(error.message as string);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  const logout = () => {
    LocalStorageService.delete(storageKeys.Auth);
    onLogout();
  };

  return (
    <section>
      <h2 className="title">
        Hello, {user?.name}
      </h2>

      <div>
        Content here
      </div>

      <button className={styles.formBtn} onClick={logout}>
        Log out
      </button>
    </section>
  );
}
