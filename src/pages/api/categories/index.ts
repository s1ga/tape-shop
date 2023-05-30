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

type Response = {
  data: string | ICategory | ICategory[];
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
      const categories = await Category.find({});
      res.status(200).json({ data: CategoryService.fromServer(categories) });
    } else if (method === httpMethods.post) {
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
