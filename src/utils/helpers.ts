import { ONLY_SPACES, PRICE_FORMATTER } from '@/constants/regex';

export function removeSpaces(str: string) {
  return str.replace(ONLY_SPACES, '');
}

export function roundPrice(num: number): number {
  return +num.toFixed(2);
}

export function formatPrice(num: number): string {
  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(PRICE_FORMATTER, ' ');
  return parts.join('.');
}
