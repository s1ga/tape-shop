export default class LocalStorageService {
  public static get<T>(key: string): T | null {
    try {
      const item: string | null = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return null;
    } catch {
      return null;
    }
  }

  public static set<T>(key: string, value: T) {
    if (value == null) {
      this.delete(key);
    }

    const valueToSet = this.getCompatibleValueToSet<T>(value);
    localStorage.setItem(key, JSON.stringify(valueToSet));
  }

  public static delete(key: string) {
    localStorage.removeItem(key);
  }

  private static getCompatibleValueToSet<T>(value: T): T {
    if (typeof value === 'object') {
      return { ...value };
    }
    return value;
  }
}
