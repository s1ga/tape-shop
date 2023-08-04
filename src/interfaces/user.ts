export interface User {
  email: string;
  name: string;
  _id: string;
  id: string;
  confirmed: boolean;
  isAdmin: boolean;
  orders: string[];
}

export type FullUser = User & {
  password: string;
  hash: string;
  hashExp: string;
  appliedCoupons: {
    id: string;
    amount: number;
  }[];
};

export type NewUser = Omit<
  FullUser, '_id' | 'id' | 'hash' | 'hashExp' | 'confirmed' | 'isAdmin' | 'appliedCoupons' | 'orders'
>
  & { hash?: string };
