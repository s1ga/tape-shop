import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import HashHandlerService from '@/services/hash.service';
import Order from '@/models/Order';
import OrderValidator from '@/validation/order.validator';
import OrderService from '@/services/order.service';
import { Order as IOrder, PreparedOrder, PreparedOrderItem } from '@/interfaces/order';
import Product from '@/models/Product';
import { Product as IProduct } from '@/interfaces/product/product';

type ApiResponse = {
  data: string | IOrder | IOrder[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  const { method } = req;

  try {
    const payload = await HashHandlerService.verifyToken(req.headers.authorization);
    if (!payload) {
      res.status(401).json({ data: 'Invalid access token' });
      return;
    }

    await dbConnect();

    if (method === httpMethods.get) {
      const orders = await Order
        .find({ userId: payload.id })
        .sort({ date: 'desc' });
      const promisifyOrders = orders.map(async (o: PreparedOrder) => {
        const orderProducts = await Promise.all(o.items
          .map((v: PreparedOrderItem) => Product.findById<IProduct>(v.info))
          .filter(Boolean));
        return OrderService.fromServer(o, orderProducts as IProduct[]);
      });
      res.status(200).json({ data: await Promise.all(promisifyOrders) });
    } else if (method === httpMethods.post) {
      const fields = OrderService.prepareFieds(req.body, payload.id);
      const existed = await Order.findOne({ orderId: fields.orderId });
      if (existed) {
        res.status(400).json({ data: 'Provided order id already exists' });
        return;
      }

      const validator = new OrderValidator(fields);
      const validation = validator.isAllValid();
      if (typeof validation === 'string') {
        res.status(400).json({ data: validation });
        return;
      }

      await Order.create(fields);
      const order = await Order.findOne({ orderId: fields.orderId });
      const products = await Promise.all(
        order.items
          .map((i: PreparedOrderItem) => Product.findById(i.info))
          .filter(Boolean),
      );
      res.status(201).json({ data: OrderService.fromServer(order, products) });
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
