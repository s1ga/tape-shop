import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import Product from '@/models/Product';
import dbConnect from '@/utils/db';
import ProductService from '@/services/product.service';
import parseForm from '@/utils/parseForm';
import { Product as IProduct, ProductItem } from '@/interfaces/product/product';

type Response = {
  data: string | ProductItem | IProduct | IProduct[];
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;

  await dbConnect();

  try {
    if (method === httpMethods.get) {
      const data = ProductService.toFullProduct(
        await Product.find({}).populate(['categories', 'productType']).exec(),
      );
      res.status(200).json({ data });
    } else if (method === httpMethods.post) {
      const { fields, files } = await parseForm(req, { multiples: true });
      const preparedFields = ProductService.prepareFields(fields);

      try {
        const validation = ProductService.validate(preparedFields, files);
        if (typeof validation === 'string') {
          res.status(400).json({ data: validation });
          return;
        }
      } catch {
        res.status(400).json({ data: 'Invalid body' });
        return;
      }

      const newProduct = await Product.create(
        await ProductService.toServer(preparedFields, files),
      );
      res.status(201).json({ data: ProductService.fromServer(newProduct) as ProductItem });
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
