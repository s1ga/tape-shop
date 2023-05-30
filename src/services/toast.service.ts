import { ToastOptions, toast } from 'react-toastify';

export default class ToastService {
  private static readonly defaultOptions: ToastOptions = {
    position: 'top-center',
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: 'light',
  };

  public static success(text: string, options: ToastOptions = {}) {
    toast.success(text, { ...this.defaultOptions, ...options });
  }

  public static error(text: string, options: ToastOptions = {}) {
    toast.error(text, { ...this.defaultOptions, ...options });
  }
}
