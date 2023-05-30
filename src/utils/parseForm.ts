import formidable, { Options, Fields, Files } from 'formidable';
import { NextApiRequest } from 'next/types';

interface FormidableParseReturn {
  fields: Fields;
  files: Files;
}

export const FileFormError = formidable.errors.FormidableError;

export default async function parseForm(
  req: NextApiRequest,
  options?: Options,
): Promise<FormidableParseReturn> {
  const form = formidable(options);

  return new Promise<FormidableParseReturn>((res, rej) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        rej(err);
      }

      res({ fields, files });
    });
  });
}
