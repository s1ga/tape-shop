import imagesMimeTypes from '@/constants/mimeTypes';
import { EMAIL_REGEX } from '@/constants/regex';
import { File } from 'formidable';

export function isValidString(str: string): boolean {
  if (!str || typeof str !== 'string') {
    return false;
  }

  return true;
}

export function isValidImage(image: File) {
  if (!image || !imagesMimeTypes.includes(image.mimetype || '')) {
    return false;
  }

  return true;
}

export function isValidNumber(number: number) {
  if (!number || typeof number !== 'number' || Number.isNaN(number)) {
    return false;
  }

  return true;
}

export function isValidObject(o: any) {
  return o !== null && typeof o === 'object';
}

export function isValidEmail(email: string) {
  return email && EMAIL_REGEX.test(email);
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}
