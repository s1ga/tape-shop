import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import Cart from '@/models/Cart';
import CartService from '@/services/cart.service';
import EncryptionService from '@/services/encryption.service';
import { Cart as ICart } from '@/interfaces/cart';
import { isValidObjectId } from 'mongoose';

type Response = {
  data?: ICart;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;

  try {
    await dbConnect();

    if (method === httpMethods.post) {
      const { userId, iv, cart } = req.body;
      if (!userId || !iv) {
        res.status(400).json({ error: 'Provide information about session' });
        return;
      }
      // TODO: validate cart
      let newCart: Partial<ICart> = cart;
      if (!cart) {
        newCart = CartService.initialCartState;
      }

      const encryptionService = new EncryptionService('');
      const encryptedUserId = await encryptionService.decrypt(userId, iv);
      if (!isValidObjectId(encryptedUserId)) {
        res.status(400).json({ error: 'Provide valid session id' });
        return;
      }
      newCart.userId = encryptedUserId;

      const foundCart = await Cart.exists({ userId: encryptedUserId }).lean();
      if (foundCart) {
        res.status(400).json({ error: 'Cart has already created for this user' });
        return;
      }

      const createdCart = await Cart.create(newCart);
      res.status(201).json({ data: CartService.fromServer(createdCart) });
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.get, httpMethods.patch, httpMethods.delete]);
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
