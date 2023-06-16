import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import Category from '@/models/Category';
import { Category as ICategory, NewCategory } from '@/interfaces/category';
import CategoryService from '@/services/category.service';
import parseForm, { FileFormError } from '@/utils/parseForm';
import { saveUploadedImage } from '@/utils/uploadedImage';
import { File } from 'formidable';
import { isValidImage, isValidString } from '@/utils/validTypes';
import HashHandlerService from '@/services/hash.service';
import itemsPerPage from '@/constants/perPage';

type Response = {
  data: string | ICategory | ICategory[];
  total?: number;
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

  try {
    await dbConnect();

    if (method === httpMethods.get) {
      const page = +(req.query.page || 1);
      const limit = page > 0 ? +(req.query.perPage || itemsPerPage.categories) : 0;
      let toSkip: number = 0;
      if (page > 0) {
        toSkip = (page - 1) * limit;
      }

      const categories = await Category
        .find({})
        .skip(toSkip)
        .limit(limit);
      const total = await Category.count();

      res.status(200).json({
        data: CategoryService.fromServer(categories),
        total,
      });
    } else if (method === httpMethods.post) {
      const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
      if (!verify) {
        res.status(401).json({ data: 'Invalid access token or role' });
        return;
      }

      const { fields, files } = await parseForm(req);
      const image = files.image as File;
      const newName = CategoryService.trimName(fields.name as string);

      if (!isValidString(newName) || !isValidImage(image)) {
        res.status(400).json({
          data: 'Name and image are required for product category and should be string and image file',
        });
        return;
      }

      const existedCategory = await Category.findOne({ name: newName });
      if (existedCategory) {
        res.status(400).json({ data: `Product category with name ${newName} is alredy exists` });
        return;
      }

      const imageUrl = await saveUploadedImage(image);
      const object: NewCategory = { name: newName, imageUrl };
      const category = await Category.create(object);
      res.status(201).json({ data: CategoryService.fromServer(category) });
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.get, httpMethods.post]);
      res.status(405).json({ data: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    if (error instanceof FileFormError) {
      res.status(error.httpCode || 400).json({ data: error.message });
    } else {
      res.status(500).json({ data: 'Internal server error' });
    }
  }
}
