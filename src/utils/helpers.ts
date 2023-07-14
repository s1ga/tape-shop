import { ONLY_SPACES, PRICE_FORMATTER } from '@/constants/regex';

const FRACTION_DIGITS = 2;

export function removeSpaces(str: string) {
  return str.replace(ONLY_SPACES, '');
}

export function roundPrice(num: number): number {
  return +num.toFixed(FRACTION_DIGITS);
}

export function formatPrice(num: number): string {
  const parts = num.toFixed(FRACTION_DIGITS).split('.');
  parts[0] = parts[0].replace(PRICE_FORMATTER, ' ');
  return parts.join('.');
}

export function equalsPrimitiveArrays(firstArray: any[], secondArray: any[]): boolean {
  return JSON.stringify(firstArray) === JSON.stringify(secondArray);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomElem(arr: unknown[] | string) {
  return arr[randomInt(0, arr.length - 1)];
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
