import { Types } from 'mongoose';

export interface ContactFeedback {
  name: string;
  email: string;
  message: string;
  reviewed: boolean;
  date: string;
  _id: string;
}

export type NewContactFeedback = Omit<ContactFeedback, '_id'>
export type ServerContactFeedback = Omit<ContactFeedback, '_id'> & { _id: Types.ObjectId }
export type PreparedContactFeedback = Omit<ContactFeedback, '_id' | 'date' | 'reviewed'>
