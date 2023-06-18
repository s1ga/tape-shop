import isBase64 from 'is-base64';
import { EMAIL_REGEX } from '@/constants/regex';

export function isValidString(str: string): boolean {
  if (!str || typeof str !== 'string') {
    return false;
  }

  return true;
}

export function isValidImage(image: string) {
  if (!image || !isBase64(image, { mimeRequired: true })) {
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
