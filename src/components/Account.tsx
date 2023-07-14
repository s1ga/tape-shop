import { useEffect, useState } from 'react';
import ToastService from '@/services/toast.service';
import { User } from '@/interfaces/user';
import { ServerData } from '@/interfaces/serverData';
import styles from '@/styles/modules/Account.module.scss';
import LinkService from '@/services/link.service';
import statusCodes from '@/constants/statusCodes';
import UserService from '@/services/user.service';
import Loader from './Loader';

const USER_URL = LinkService.apiUserLink();
const ERROR_TOAST_ID = 'fetch-user-error';

export default function Account({ onLogout }: { onLogout: CallableFunction }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>();

  const logout = () => {
    UserService.deleteUserToken();
    onLogout();
  };

  useEffect(() => {
    setLoading(true);
    fetch(USER_URL, {
      headers: {
        Authorization: UserService.getUserToken(),
      },
    })
      .then(async (res: Response) => {
        const { data }: ServerData<User | string> = await res.json();
        if (res.status === statusCodes.Unauthorized) {
          logout();
          return;
        }
        if (!res.ok) {
          throw new Error(data as string);
        }
        setUser(data as User);
      })
      .catch((error: any) => {
        console.error(error);
        ToastService.error(error.message as string, {
          toastId: ERROR_TOAST_ID,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

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
