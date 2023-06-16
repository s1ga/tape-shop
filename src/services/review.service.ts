import { NewReview, PreparedReview, Review as IReview, FullReview } from '@/interfaces/review';
import Review from '@/models/Review';
import { isValidEmail, isValidNumber, isValidString } from '@/utils/validTypes';
import { Types, isValidObjectId } from 'mongoose';

export default class ReviewService {
  public static fromServer(item: any | any[]): IReview | IReview[] {
    const mapObject = (o: any): IReview => ({
      _id: o._id.toString(),
      id: o._id.toString(),
      productId: o.productId.toString(),
      name: o.name,
      rating: o.rating,
      date: o.date,
      text: o.text,
      isChecked: o.isChecked,
      isApproved: o.isApproved,
    });

    if (Array.isArray(item)) {
      return item.map(mapObject);
    }
    return mapObject(item);
  }

  public static fromFullServer(item: any | any[]): FullReview | FullReview[] {
    const mapObject = (o: any): FullReview => ({
      email: o.email,
      ...this.fromServer(o),
    }) as unknown as FullReview;

    if (Array.isArray(item)) {
      return item.map(mapObject);
    }
    return mapObject(item);
  }

  public static validate(fields: PreparedReview): boolean | string {
    if (!isValidObjectId(fields.productId)) {
      return 'Provide valid product ID';
    }
    if (!isValidNumber(+fields.rating)) {
      return 'Rating is required and should be number';
    }
    if (!isValidString(fields.text)) {
      return 'Text required and should be string';
    }
    if (!isValidString(fields.name)) {
      return 'Name is required and should be string';
    }
    if (!isValidEmail(fields.email)) {
      return 'Email is required and should be valid';
    }
    return true;
  }

  public static prepareFields(body: any): PreparedReview {
    return {
      productId: body.productId,
      name: body.name,
      text: body.text,
      email: body.email,
      rating: +body.rating,
      isChecked: false,
      isApproved: false,
    };
  }

  public static toServer(fields: PreparedReview): NewReview {
    return {
      name: fields.name,
      text: fields.text,
      email: fields.email,
      rating: +fields.rating,
      productId: new Types.ObjectId(fields.productId),
      date: new Date().toISOString(),
      isApproved: fields.isApproved,
      isChecked: fields.isChecked,
    };
  }

  public static getByProductId(productId: string) {
    return Review
      .find({ productId: new Types.ObjectId(productId as string) })
      .sort({ date: 'desc' })
      .exec();
  }
}
