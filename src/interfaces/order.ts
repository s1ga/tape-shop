import trackingStatuses from '@/constants/trackingStatuses';
import { ProductItemPreview } from './product/product';

export interface PreparedOrderItem {
  info: string;
  total: number;
}

export interface OrderItem {
  info: ProductItemPreview;
  total: number;
}

export interface Order {
  _id: string;
  orderId: string;
  userId: string;
  items: OrderItem[];
  total: number;
  date: string;
  status?: keyof typeof trackingStatuses;
  trackingUrl: string;
  trackingNumber?: string;
}

export type PreparedOrder = Omit<Order, '_id' | 'items'> & {
  items: PreparedOrderItem[];
}

export type NewOrder = Omit<PreparedOrder, 'date' | 'userId'>;
