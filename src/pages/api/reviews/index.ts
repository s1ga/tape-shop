import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import { Types, isValidObjectId } from 'mongoose';
import Review from '@/models/Review';
import ReviewService from '@/services/review.service';
import { Review as IReview } from '@/interfaces/review';
import Product from '@/models/Product';

type Response = {
  data: string | IReview | IReview[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;

  await dbConnect();

  try {
    if (method === httpMethods.get) {
      const { productId } = req.query;
      let review;
      if (productId) {
        if (isValidObjectId(productId)) {
          review = await ReviewService.getByProductId(productId as string);
        } else {
          res.status(400).json({ data: 'Provide valid product ID' });
          return;
        }
      } else {
        review = await Review.find({});
      }

      res.status(200).json({ data: ReviewService.fromServer(review) });
    } else if (method === httpMethods.post) {
      const { body } = req;
      const fields = ReviewService.prepareFields(body);
      const result = ReviewService.validate(fields);

      if (typeof result === 'string') {
        res.status(400).json({ data: result });
        return;
      }
      const product = await Product.findById(new Types.ObjectId(fields.productId));
      if (!product) {
        res.status(404).json({ data: 'There is no product with given ID' });
        return;
      }

      const review = await Review.create(ReviewService.toServer(fields));
      res.status(201).json({ data: ReviewService.fromServer(review) });
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.get, httpMethods.post]);
      res.status(405).json({ data: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: 'Internal server error' });
  }
}
