import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import User from '@/models/User';
import { User as IUser } from '@/interfaces/user';
import HashHandlerService from '@/services/hash.service';
import UserService from '@/services/user.service';
import MailService from '@/services/mail.service';

type Response = {
  data: string | IUser;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;

  try {
    await dbConnect();

    if (method === httpMethods.get) {
      const verify = await HashHandlerService.verifyToken(req.headers.authorization);
      if (!verify) {
        res.status(401).json({ data: 'Invalid access token' });
        return;
      }

      const user = await User.findOne({ email: verify.email });
      if (!user) {
        res.status(404).json({ data: 'User not found' });
        return;
      }
      res.status(200).json({ data: UserService.fromServer(user) });
    } else if (method === httpMethods.post) {
      const { email, name, password } = req.body;
      const validation = UserService.validate({ email, name, password });
      if (typeof validation === 'string') {
        res.status(400).json({ data: validation });
        return;
      }

      const candidate = await User.findOne({ email });
      if (candidate) {
        res.status(422).json({ data: 'User already exists' });
        return;
      }

      const hash = await HashHandlerService.hashData(`${Date.now().toString()}_${email}`);
      const hashPassword = await HashHandlerService.hashData(password);
      const user = await User.create(UserService.toServer(email, name, hashPassword, hash));
      await MailService.register(email, hash);
      res.status(201).json({ data: UserService.fromServer(user) });
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