import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import Product from '@/models/Product';
import parseForm from '@/utils/parseForm';
import ProductService from '@/services/product.service';
import { Types } from 'mongoose';
import { Product as IProduct } from '@/interfaces/product/product';
import HashHandlerService from '@/services/hash.service';
import { removeUploadedImage } from '@/utils/uploadedImage';

export const config = {
  api: {
    bodyParser: false,
  },
};

type Response = {
  data: string | IProduct;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;
  const { id = '' } = req.query;

  if (!Types.ObjectId.isValid(id as string)) {
    res.status(404).json({ data: `There is no such product with given ID: ${id}` });
    return;
  }

  try {
    await dbConnect();

    const objectId = new Types.ObjectId(id as string);
    const foundType = await Product
      .findOne({ _id: objectId })
      .populate(['categories', 'productType'])
      .exec();

    if (!foundType) {
      res.status(404).json({ data: `There is no such product with given ID: ${id}` });
      return;
    }

    if (method === httpMethods.get) {
      res.status(200).json({ data: ProductService.toFullProduct(foundType) as IProduct });
    } else if (method === httpMethods.patch) {
      const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
      if (!verify) {
        res.status(401).json({ data: 'Invalid access token or role' });
        return;
      }

      const { fields, files } = await parseForm(req, { multiples: true });
      const obj = await ProductService.preparePatchedFields(
        fields,
        files,
        foundType.images,
        foundType.features.image || '',
      );
      if (typeof obj === 'string') {
        res.status(400).json({ data: obj });
        return;
      }

      let updated = foundType;
      if (Object.keys(obj).length) {
        updated = await Product
          .findByIdAndUpdate(objectId, obj, { new: true })
          .populate(['categories', 'productType'])
          .exec();
      }

      res.status(200).json({ data: ProductService.toFullProduct(updated) as IProduct });
    } else if (method === httpMethods.delete) {
      const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
      if (!verify) {
        res.status(401).json({ data: 'Invalid access token or role' });
        return;
      }

      if (foundType.features.image) {
        await removeUploadedImage(foundType.features.image);
      }
      await Promise.all(foundType.images.map(removeUploadedImage));
      await Product.findOneAndDelete({ _id: id });
      res.status(200).json({ data: ProductService.toFullProduct(foundType) as IProduct });
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.get, httpMethods.patch, httpMethods.delete]);
      res.status(405).json({ data: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: 'Internal server error' });
  }
}
