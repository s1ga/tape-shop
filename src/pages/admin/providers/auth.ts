import httpMethods from '@/constants/httpMethods';
import storageKeys from '@/constants/storageKeys';
import LocalStorageService from '@/services/storage.service';
import getDomain from '@/utils/getDomain';
import { AuthProvider } from 'react-admin';

const authProvider: AuthProvider = {
  login: ({ username, password }) => {
    const request = new Request(`${getDomain()}/api/user/login`, {
      method: httpMethods.post,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ email: username, password }),
    });

    return fetch(request)
      .then(async (res: Response) => {
        const { data } = await res.json();
        if (!res.ok) {
          throw new Error(data);
        }
        return data;
      })
      .then((data) => {
        LocalStorageService.set(storageKeys.AdminAuth, data);
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  },
  checkError: (error) => {
    const { statusCode } = error;
    if (statusCode === 401 || statusCode === 403) {
      LocalStorageService.delete(storageKeys.AdminAuth);
      return Promise.reject({ message: 'Unauthorized user!' });
    }
    return Promise.resolve();
  },
  checkAuth: () => (LocalStorageService.get(storageKeys.AdminAuth)
    ? Promise.resolve()
    : Promise.reject()),
  getPermissions: () => Promise.resolve(),
  logout: () => {
    LocalStorageService.delete(storageKeys.AdminAuth);
    return Promise.resolve();
  },
};

export default authProvider;
