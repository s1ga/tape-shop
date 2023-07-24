import { useLayoutEffect, useState } from 'react';
import ToastService from '@/services/toast.service';
import { User } from '@/interfaces/user';
import { ServerData } from '@/interfaces/serverData';
import styles from '@/styles/modules/Account.module.scss';
import LinkService from '@/services/link.service';
import statusCodes from '@/constants/statusCodes';
import UserService from '@/services/user.service';
import ShippingService from '@/services/shipping.service';
import { useCartContext } from '@/context/cartContext';

const USER_URL = LinkService.apiUserLink();
const ERROR_TOAST_ID = 'fetch-user-error';

export default function Account({ onLogout }: { onLogout: CallableFunction }) {
  const { getSessionCart, resetCart, setLoading } = useCartContext();
  const [user, setUser] = useState<User>();

  const resetState = () => {
    resetCart();
    ShippingService.deleteShippingRateFromStorage();
    UserService.deleteUserToken();
    UserService.deleteSession();
  };

  const logout = () => {
    resetState();
    getSessionCart(true);
    onLogout();
  };

  const login = (data: User) => {
    setUser(data);
    UserService.setSession(data._id);
    getSessionCart();
  };

  useLayoutEffect(() => {
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
        }
        if (!res.ok) {
          throw new Error(data as string);
        }
        login(data as User);
      })
      .catch((error: any) => {
        setLoading(false);
        console.error(error);
        ToastService.error(error.message as string, {
          toastId: ERROR_TOAST_ID,
        });
      });
  }, []);

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
