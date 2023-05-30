import { File } from 'formidable';
import { rename, unlink } from 'fs/promises';
import { extname } from 'path';

const folder = './public';

export async function saveUploadedImage(file: File): Promise<string> {
  const fileFolder = '/images/uploaded';

  const ext = extname(file.originalFilename || '');
  const newFilePath = `${fileFolder}/${file.newFilename}${ext}`;
  const newFolderPath = `${folder}/${newFilePath}`;
  await rename(file.filepath, newFolderPath);

  return newFilePath;
}

export async function removeUploadedImage(path: string): Promise<void> {
  await unlink(`${folder}/${path}`);
}
