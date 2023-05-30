import { Types } from 'mongoose';

export interface Review {
  _id: string;
  productId: string;
  rating: number;
  text: string;
  name: string;
  date: string;
}

export type PreparedReview = Omit<Review, '_id' | 'date'> & { email: string };

export type NewReview = Omit<PreparedReview, 'productId'> & {
  date: string;
  productId: Types.ObjectId,
}
