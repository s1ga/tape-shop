import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import Type from '@/models/Type';
import dbConnect from '@/utils/db';
import TypeService from '@/services/type.service';
import { Type as IType, NewType } from '@/interfaces/type';
import { isValidObjectId } from 'mongoose';

type Response = {
  data: string | IType | IType[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;

  await dbConnect();

  try {
    if (method === httpMethods.get) {
      const types = await Type.find({}).populate('categories').exec();
      res.status(200).json({ data: TypeService.fromServer(types) });
    } else if (method === httpMethods.post) {
      const { name, categories } = req.body;
      const generateId = TypeService.generateId(name);
      if (
        !generateId || !categories || !Array.isArray(categories)
        || !categories.every(isValidObjectId)
      ) {
        res.status(400).json({ data: 'Name and categories are required for product type' });
        return;
      }

      const existedType = await Type.findOne({ id: generateId });
      if (existedType) {
        res.status(400).json({ data: `Product type with name ${name} is alredy exists` });
        return;
      }

      const obj: Partial<NewType> = { id: generateId, name, categories };
      const type = await Type.create(TypeService.toServer(obj));
      res.status(201).json({ data: TypeService.fromServer(type) });
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
