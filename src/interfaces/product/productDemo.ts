import { isValidString } from '@/utils/validTypes';

export interface ProductItemDemo {
  video: string;
  description: string;
}

export function isProductItemDemo(obj: any): obj is ProductItemDemo {
  return isValidString(obj?.video) && isValidString(obj?.description);
}
