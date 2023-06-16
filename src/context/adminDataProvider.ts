import httpMethods from '@/constants/httpMethods';
import getDomain from '@/utils/getDomain';
import ServerError from '@/utils/serverError';
import { CreateParams, DataProvider, GetOneParams, UpdateManyParams, UpdateParams } from 'react-admin';
import { ServerData } from '@/interfaces/serverData';
import LocalStorageService from '@/services/storage.service';
import storageKeys from '@/constants/storageKeys';
import { Type } from '@/interfaces/type';
import { Category } from '@/interfaces/category';
import { equalsPrimitiveArrays } from '@/utils/helpers';
import adminResourceMap from '@/constants/admin-resources';
import buildUrlQuery from '@/utils/buildUrlQuery';

const BASE_URL = `${getDomain()}/api`;

const thenFunc = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    throw new ServerError(data.data, res.status);
  }
  return data;
};

const updateMutation = (resource: string, params: UpdateParams<any>) => {
  console.log(resource, params);
  const token = LocalStorageService.get<string>(storageKeys.AdminAuth) || '';
  const setRequest = (body: any) => new Request(`${BASE_URL}/${resource}/${params.id}`, {
    method: httpMethods.patch,
    body,
    headers: new Headers({ Authorization: token }),
  });
  switch (resource) {
    case adminResourceMap.categories: {
      const body = new FormData();
      if (params.previousData.name !== params.data.name) {
        body.append('name', params.data.name);
      }
      if (params.data.imageUrl.rawFile) {
        body.append('image', params.data.imageUrl.rawFile);
      }
      return fetch(setRequest(body)).then(thenFunc);
    }
    case adminResourceMap.types: {
      const body: Record<string, string | string[]> = {};
      if (params.previousData.name !== params.data.name) {
        body.name = params.data.name;
      }
      const categoryIds = params.data.categories.map((c: Category) => c._id);
      if (!equalsPrimitiveArrays(categoryIds, params.previousData.categories)) {
        body.categories = categoryIds;
      }
      const request = setRequest(JSON.stringify(body));
      request.headers.set('Content-Type', 'Application/json');
      return fetch(request).then(thenFunc);
    }
    case adminResourceMap.feedback: {
      const request = setRequest(JSON.stringify({ reviewed: params.data.reviewed }));
      request.headers.set('Content-Type', 'Application/json');
      return fetch(request).then(thenFunc);
    }
    case adminResourceMap.reviews: {
      const request = setRequest(JSON.stringify({
        isApproved: params.data.isApproved,
        isChecked: params.data.isChecked,
      }));
      request.headers.set('Content-Type', 'Application/json');
      return fetch(request).then(thenFunc);
    }
    case adminResourceMap.products: {
      const { data } = params;
      const body = new FormData();
      if (data.features?.image?.rawFile) {
        body.append('featureImage', data.features?.image?.rawFile);
        data.features.image = undefined;
      } else if (typeof data.features?.image !== 'string') {
        data.features.image = undefined;
      }
      body.append('name', data.name);
      body.append('price', data.price);
      body.append('sku', data.sku);
      body.append('availability', data.availability);
      body.append('description', data.description);
      body.append('characteristics', JSON.stringify(data.characteristics));
      body.append('features', JSON.stringify(data.features));
      body.append('related', JSON.stringify(data.related || []));
      body.append('productType', JSON.stringify([data.productType]));
      body.append('categories', JSON.stringify(data.categories));
      body.append('additionalInformation', JSON.stringify(data.additionalInformation || []));
      body.append('demo', JSON.stringify(data.demo));
      const images: File[] = [];
      const remainedImages: string[] = data.images
        .filter((i: any) => {
          const file = i.rawFile;
          if (file) {
            images.push(file);
          }
          return !file;
        })
        .map((i: any) => i.src);
      body.append('remainedImages', JSON.stringify(remainedImages));
      images.forEach((f: File) => body.append('images', f));
      return fetch(setRequest(body)).then(thenFunc);
    }
    default:
      console.warn(`No handler for resource ${resource}`);
      return Promise.reject();
  }
};

const updateManyMutation = async (resource: string, params: UpdateManyParams) => {
  console.log(resource, params);
  const token = LocalStorageService.get<string>(storageKeys.AdminAuth) || '';
  switch (resource) {
    case adminResourceMap.feedback: {
      const setRequest = (id: string | number) => new Request(`${BASE_URL}/${resource}/${id}`, {
        method: httpMethods.patch,
        body: JSON.stringify({ reviewed: params.data.reviewed }),
        headers: new Headers({
          Authorization: token,
          'Content-Type': 'Application/json',
        }),
      });
      return Promise.resolve({
        data: await Promise.all(
          params.ids.map((id: string | number) => fetch(setRequest(id)).then(thenFunc)),
        ),
      });
    }
    case adminResourceMap.reviews: {
      const update = (id: string | number) => fetch(new Request(`${BASE_URL}/${resource}/${id}`, {
        method: httpMethods.patch,
        body: JSON.stringify(params.data),
        headers: new Headers({
          Authorization: token,
          'Content-Type': 'Application/json',
        }),
      })).then(thenFunc);
      return Promise.resolve({
        data: await Promise.all(
          params.ids.map(update),
        ),
      });
    }
    default:
      console.warn(`No handler for resource ${resource}`);
      return Promise.reject();
  }
};

const createMutation = (resource: string, params: CreateParams) => {
  const token = LocalStorageService.get<string>(storageKeys.AdminAuth) || '';
  const setRequest = (body: any) => new Request(`${BASE_URL}/${resource}`, {
    method: httpMethods.post,
    body,
    headers: new Headers({ Authorization: token }),
  });
  switch (resource) {
    case adminResourceMap.categories: {
      const body = new FormData();
      body.append('name', params.data.name);
      body.append('image', params.data.image.rawFile);
      return fetch(setRequest(body)).then(thenFunc);
    }
    case adminResourceMap.types: {
      const body: Record<string, string | string[]> = {};
      body.name = params.data.name;
      body.categories = params.data.categories;
      const request = setRequest(JSON.stringify(body));
      request.headers.set('Content-Type', 'Application/json');
      return fetch(request).then(thenFunc);
    }
    case adminResourceMap.products: {
      const { data } = params;
      const body = new FormData();
      if (data.demo) {
        body.append('demo', JSON.stringify(data.demo));
      }
      body.append('name', data.name);
      body.append('price', data.price);
      body.append('sku', data.sku);
      body.append('availability', data.availability);
      body.append('description', data.description);
      body.append('characteristics', JSON.stringify(data.characteristics));
      body.append('features', JSON.stringify(data.features));
      body.append('related', JSON.stringify(data.related || []));
      body.append('productType', JSON.stringify([data.productType]));
      body.append('categories', JSON.stringify(data.categories));
      body.append('additionalInformation', JSON.stringify(data.additionalInformation || []));
      body.append('featureImage', data.featureImage);
      data.images.forEach((file: File) => body.append('images', file));
      return fetch(setRequest(body)).then(thenFunc);
    }
    default:
      console.warn(`No handler for resource ${resource}`);
      return Promise.reject();
  }
};

const getOneMutation = (resource: string, params: GetOneParams<any>) => {
  const headers = new Headers();
  if (resource === adminResourceMap.reviews) {
    headers.set('Authorization', LocalStorageService.get<string>(storageKeys.AdminAuth) || '');
  }
  return fetch(`${BASE_URL}/${resource}/${params.id}`, { headers })
    .then(thenFunc)
    .then((data: ServerData<any>) => {
      const updated = { ...data };
      switch (resource) {
        case adminResourceMap.categories:
          updated.data.imageUrl = { id: data.data.imageUrl, src: data.data.imageUrl };
          break;
        case adminResourceMap.types:
          updated.data.categories = updated.data.categories.map((c: Category) => c._id);
          break;
        case adminResourceMap.products:
          updated.data.images = data.data.images.map((src: string) => ({ id: src, src }));
          updated.data.characteristics.items = data.data.characteristics.items
            .map((field: string) => ({ field }));
          updated.data.productType = data.data.productType[0]._id;
          updated.data.categories = data.data.categories
            .map((t: Category) => t._id);
          break;
        default:
          break;
      }
      return updated;
    });
};

const dataProvider: DataProvider = {
  getList: (resource, params) => {
    const headers = new Headers();
    if (resource === adminResourceMap.reviews) {
      headers.set('Authorization', LocalStorageService.get<string>(storageKeys.AdminAuth) || '');
    }
    return fetch(`${BASE_URL}/${resource}?${buildUrlQuery(params)}`, {
      headers,
    }).then(thenFunc);
  },
  getOne: getOneMutation,
  getMany: () => Promise.resolve({ data: [] }),
  getManyReference: () => Promise.resolve({ data: [], total: 0 }),
  update: updateMutation,
  updateMany: updateManyMutation,
  create: createMutation,
  delete: (resource, params) => {
    const token = LocalStorageService.get<string>(storageKeys.AdminAuth) || '';
    const request = new Request(`${BASE_URL}/${resource}/${params.id}`, {
      method: httpMethods.delete,
      headers: new Headers({ Authorization: token }),
    });
    return fetch(request).then(thenFunc);
  },
  deleteMany: async (resource, params) => {
    const token = LocalStorageService.get<string>(storageKeys.AdminAuth) || '';
    const request = (id: any) => fetch(new Request(`${BASE_URL}/${resource}/${id}`, {
      method: httpMethods.delete,
      headers: new Headers({ Authorization: token }),
    })).then(thenFunc).then(({ data }: ServerData<Type>) => data._id);

    return Promise.resolve({ data: await Promise.all(params.ids.map(request)) });
  },
};

export default dataProvider;
