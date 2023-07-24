import { PASSWORD_REGEX } from '@/constants/regex';
import { NewUser, User } from '@/interfaces/user';
import { isValidEmail, isValidString } from '@/utils/validTypes';
import storageKeys from '@/constants/storageKeys';
import LocalStorageService from './storage.service';

export default class UserService {
  public static getUserToken(): string {
    return LocalStorageService.get<string>(storageKeys.Auth) || '';
  }

  public static setUserToken(token: string): void {
    LocalStorageService.set<string>(storageKeys.Auth, token);
  }

  public static deleteUserToken(): void {
    LocalStorageService.delete(storageKeys.Auth);
  }

  public static getSession(): string {
    return LocalStorageService.get<string>(storageKeys.SessionId) || '';
  }

  public static setSession(id: string): void {
    LocalStorageService.set<string>(storageKeys.SessionId, id);
  }

  public static deleteSession(): void {
    LocalStorageService.delete(storageKeys.SessionId);
  }

  public static newUser(body: any): NewUser {
    return ({
      name: body.name,
      email: body.email,
      password: body.password,
    });
  }

  public static toServer(email: string, name: string, password: string, hash: string): NewUser {
    return ({
      name,
      email,
      password,
      hash,
    });
  }

  public static fromServer(user: any): User {
    return ({
      _id: user._id?.toString(),
      id: user._id?.toString(),
      email: user.email,
      name: user.name,
      confirmed: user.confirmed,
      isAdmin: user.isAdmin,
    });
  }

  public static validate(user: NewUser): boolean | string {
    if (!isValidString(user.name) || user.name.length < 2) {
      return 'Name should be minimum 2 characters';
    }
    if (!PASSWORD_REGEX.test(user.password)) {
      return `Password should be minimum 8 characters, 
      contains digits, 1 lowercase and 1 uppercase letters.`;
    }
    if (!isValidEmail(user.email)) {
      return 'Provide valid email';
    }
    return true;
  }
}
