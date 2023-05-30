import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import Category from '@/models/Category';
import { Category as ICategory, NewCategory } from '@/interfaces/category';
import CategoryService from '@/services/category.service';
import { Types } from 'mongoose';
import parseForm from '@/utils/parseForm';
import { File } from 'formidable';
import { saveUploadedImage, removeUploadedImage } from '@/utils/uploadedImage';
import { isValidString, isValidImage } from '@/utils/validTypes';

type Response = {
  data: string | ICategory;
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
  const { id = '' } = req.query;

  if (!Types.ObjectId.isValid(id as string)) {
    res.status(404).json({ data: `There is no such product category with given ID: ${id}` });
    return;
  }

  await dbConnect();

  try {
    const objectId = new Types.ObjectId(id as string);
    const foundType = await Category.findById<ICategory>(objectId);

    if (!foundType) {
      res.status(404).json({ data: `There is no such product category with given ID: ${id}` });
      return;
    }

    if (method === httpMethods.get) {
      res.status(200).json({ data: foundType });
    } else if (method === httpMethods.patch) {
      const { fields, files } = await parseForm(req);
      const image = files.image as File;
      const newName = CategoryService.trimName(fields.name as string);

      const isValidName = isValidString(newName);
      const isValidImg = isValidImage(image);

      if (!isValidName && !isValidImg) {
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

      let object: Partial<NewCategory> = {};
      if (isValidImg) {
        const imageUrl = await saveUploadedImage(image);
        await removeUploadedImage(foundType.imageUrl);
        object = { ...object, imageUrl };
      }
      if (isValidName) {
        object = { ...object, name: newName };
      }

      const category = await Category.findByIdAndUpdate(objectId, object, {
        new: true,
      });
      res.status(201).json({ data: CategoryService.fromServer(category) as ICategory });
    } else if (method === httpMethods.delete) {
      await Category.findByIdAndDelete(objectId);
      res.status(200).json({ data: 'Product category has been sucessfully deleted' });
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
