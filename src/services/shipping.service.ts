import { CartItem } from '@/interfaces/cart';
import { ShippingDestination, ShippingRatesRequest } from '@/interfaces/shippingRates';
import storageKeys from '@/constants/storageKeys';
import LocalStorageService from './storage.service';

export default class ShippingService {
  private static readonly apiKey = process.env.STARSHIPIT_API_KEY || '';
  private static readonly subKey = process.env.STARSHIPIT_SUB_KEY || '';

  public static prepareHeaders() {
    return {
      'StarShipIT-Api-Key': this.apiKey,
      'Ocp-Apim-Subscription-Key': this.subKey,
    };
  }

  public static prepareDestination(form: FormData): ShippingRatesRequest['destination'] {
    const getFormField = (field: string) => form.get(field)?.toString() || '';
    return {
      street: getFormField('street'),
      city: getFormField('city'),
      post_code: getFormField('postal'),
      country_code: getFormField('country'),
    };
  }

  public static prepareRatesBody(destination: ShippingRatesRequest['destination'], cart: CartItem[])
    : ShippingRatesRequest {
    return {
      destination,
      packages: cart.map((item: CartItem) => ({
        weight: (item.total * item.info.weight) / 1000,
      })),
    };
  }

  public static getDestinationFromStorage(): ShippingDestination | null {
    return LocalStorageService.get<ShippingDestination>(storageKeys.ShippingDestination);
  }

  public static saveDestinationInStorage(destination: ShippingDestination): void {
    LocalStorageService.set<ShippingDestination>(storageKeys.ShippingDestination, destination);
  }

  public static deleteDestinationFromStorage(): void {
    LocalStorageService.delete(storageKeys.ShippingDestination);
  }
}