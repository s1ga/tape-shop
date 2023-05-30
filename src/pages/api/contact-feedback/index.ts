import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import ContactFeedback from '@/models/ContactFeedback';
import ContactFeedbackService from '@/services/contactFeedback.service';
import { ContactFeedback as IContactFeedback, ServerContactFeedback } from '@/interfaces/contactFeedback';
import sortingValue from '@/constants/sortingValues';
import { Query, SortOrder } from 'mongoose';

type Response = {
  data: string | IContactFeedback | IContactFeedback[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;

  await dbConnect();

  try {
    if (method === httpMethods.get) {
      const { sort, reviewed } = req.query as { sort: string, reviewed: string };
      let query: Query<ServerContactFeedback[], ServerContactFeedback>;

      if (['true', 'false'].includes(reviewed)) {
        const val = reviewed === 'true';
        query = ContactFeedback.find({ reviewed: val });
      } else {
        query = ContactFeedback.find({});
      }

      const sortOption = +sort || sort;
      if (sortingValue.includes(sortOption)) {
        query = query.sort({ date: sortOption as SortOrder });
      }

      const feedbacks = await query.exec();
      res.status(200).json({ data: ContactFeedbackService.fromServer(feedbacks) as IContactFeedback[] });
    } else if (method === httpMethods.post) {
      const fields = ContactFeedbackService.prepareFields(req.body);
      const result = ContactFeedbackService.validate(fields);

      if (typeof result === 'string') {
        res.status(400).json({ data: result });
        return;
      }

      await ContactFeedback.create(ContactFeedbackService.toServer(fields));
      res.status(201).json({ data: 'Your feedback has been sent successfully' });
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
