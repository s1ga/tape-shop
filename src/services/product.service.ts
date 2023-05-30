import {
  NewProductItem, PreparedProductItem, Product as IProduct, ProductItem, ProductItemPreview,
} from '@/interfaces/product/product';
import Product from '@/models/Product';
import { removeUploadedImage, saveUploadedImage } from '@/utils/uploadedImage';
import ProductValidator from '@/validation/product.validator';
import { Fields, Files } from 'formidable';
import { Types } from 'mongoose';
import CategoryService from './category.service';
import TypeService from './type.service';

export default class ProductService {
  public static validate(body: any, files: Files): string | boolean {
    const validator = new ProductValidator(body, files);
    return validator.isAllValid();
  }

  public static prepareFields(fields: Fields): PreparedProductItem {
    const obj: PreparedProductItem = {
      name: fields.name as string,
      price: +fields.price,
      categories: JSON.parse(fields.categories as string),
      productType: JSON.parse(fields.productType as string),
      sku: fields.sku as string,
      description: fields.description as string,
      characteristics: JSON.parse(fields.characteristics as string),
    };
    if (fields.related) {
      obj.related = JSON.parse(fields.related as string);
    }
    if (fields.availability) {
      obj.availability = +fields.availability;
    }
    if (fields.features) {
      obj.features = JSON.parse(fields.features as string);
    }
    if (fields.demo) {
      obj.demo = JSON.parse(fields.demo as string);
    }
    if (fields.additionalInformation) {
      obj.additionalInformation = JSON.parse(fields.additionalInformation as string);
    }
    return obj;
  }

  public static async preparePatchedFields(fields: Fields, files: Files, oldImages: string[])
    : Promise<Partial<IProduct> | string> {
    const validator = new ProductValidator(null, null);

    const obj: Partial<IProduct> = {};
    if (fields.name) {
      const result = validator.isValidName(fields.name as string);
      if (typeof result === 'string') {
        return result;
      }
      obj.name = fields.name as string;
    }
    if (fields.price) {
      const result = validator.isValidPrice(+fields.price);
      if (typeof result === 'string') {
        return result;
      }
      obj.price = +fields.price;
    }
    if (fields.categories) {
      const categories = JSON.parse(fields.categories as string);
      const result = validator.isValidCategories(categories);
      if (typeof result === 'string') {
        return result;
      }
      obj.categories = categories;
    }
    if (fields.productType) {
      const productType = JSON.parse(fields.productType as string);
      const result = validator.isValidproductType(productType);
      if (typeof result === 'string') {
        return result;
      }
      obj.productType = productType;
    }
    if (fields.related) {
      const related = JSON.parse(fields.related as string);
      const result = validator.isValidRelatedProducts(related);
      if (typeof result === 'string') {
        return result;
      }
      obj.related = related;
    }
    if (fields.sku) {
      const result = validator.isValidSku(fields.sku as string);
      if (typeof result === 'string') {
        return result;
      }
      obj.sku = fields.sku as string;
    }
    if (fields.description) {
      const result = validator.isValidDescription(fields.description as string);
      if (typeof result === 'string') {
        return result;
      }
      obj.description = fields.description as string;
    }
    if (fields.characteristics) {
      const characteristics = JSON.parse(fields.characteristics as string);
      const result = validator.isValidCharacteristics(characteristics);
      if (typeof result === 'string') {
        return result;
      }
      obj.characteristics = characteristics;
    }
    if (fields.features) {
      const features = JSON.parse(fields.features as string);
      const result = validator.isValidFeatures(features);
      if (typeof result === 'string') {
        return result;
      }
      obj.features = features;
    }
    if (fields.demo) {
      const demo = JSON.parse(fields.demo as string);
      const result = validator.isValidDemo(demo);
      if (typeof result === 'string') {
        return result;
      }
      obj.demo = demo;
    }
    if (fields.additionalInformation) {
      const additionalInformation = JSON.parse(fields.additionalInformation as string);
      const result = validator.isValidAdditionalInfo(additionalInformation);
      if (typeof result === 'string') {
        return result;
      }
      obj.additionalInformation = additionalInformation;
    }
    if (fields.availability) {
      const result = validator.isValidAvailability(+fields.availability);
      if (typeof result === 'string') {
        return result;
      }
      obj.availability = +fields.availability;
    }
    if (files.images) {
      const images = Array.isArray(files.images) ? files.images : [files.images];
      const result = validator.isValidImages(images);
      if (typeof result === 'string') {
        return result;
      }

      await Promise.all(oldImages.map(removeUploadedImage));
      obj.images = await this.addImages(files);
    }

    return obj;
  }

  public static async toServer(fields: PreparedProductItem, files: Files): Promise<NewProductItem> {
    return {
      ...fields,
      dateAdded: new Date().toISOString(),
      categories: fields.categories!.map((id: string) => new Types.ObjectId(id)),
      productType: [new Types.ObjectId(fields.productType[0])],
      related: (fields.related || []).map((id: string) => new Types.ObjectId(id)),
      images: await this.addImages(files),
    };
  }

  public static fromServer(item: any | any[]): ProductItem | ProductItem[] {
    const mapObject = (o: any) => ({
      _id: o._id,
      name: o.name,
      price: o.price,
      rate: o.rate || 0,
      dateAdded: o.dateAdded,
      sku: o.sku,
      description: o.description,
      images: o.images,
      characteristics: o.characteristics,
      availability: o.availability,
      features: o.features,
      demo: o.demo,
      additionalInformation: o.additionalInformation,
      categories: o.categories.map((id: Types.ObjectId) => id.toString()),
      productType: o.productType.map((id: Types.ObjectId) => id.toString()),
      related: (o.related || []).map((id: Types.ObjectId) => id.toString()),
    });

    if (Array.isArray(item)) {
      return item.map(mapObject);
    }

    return mapObject(item);
  }

  public static toFullProduct(product: any): IProduct | IProduct[] {
    const mapObject = (o: any) => ({
      _id: o._id,
      name: o.name,
      price: o.price,
      rate: o.rate || 0,
      dateAdded: o.dateAdded,
      sku: o.sku,
      description: o.description,
      images: o.images,
      characteristics: o.characteristics,
      availability: o.availability,
      features: o.features,
      demo: o.demo,
      additionalInformation: o.additionalInformation,
      categories: o.categories.map(CategoryService.fromServer),
      productType: o.productType.map(TypeService.fromServer),
      related: (o.related || []).map((id: Types.ObjectId) => id.toString()),
    });

    if (Array.isArray(product)) {
      return product.map(mapObject);
    }
    return mapObject(product);
  }

  public static toPreview(products: IProduct | IProduct[]): ProductItemPreview | ProductItemPreview[] {
    const mapObject = (o: IProduct): ProductItemPreview => ({
      _id: o._id,
      name: o.name,
      rate: o.rate || 0,
      images: o.images,
      price: o.price,
      categories: o.categories,
      dateAdded: o.dateAdded,
    });

    if (Array.isArray(products)) {
      return products.map(mapObject);
    }
    return mapObject(products);
  }

  private static async addImages(files: Files): Promise<string[]> {
    const images = Array.isArray(files.images) ? files.images : [files.images];
    return Promise.all(images.map(saveUploadedImage));
  }

  public static getByTypeCategories(typeId: string, categoryId: string) {
    return Product
      .find({
        productType: new Types.ObjectId(typeId),
        categories: new Types.ObjectId(categoryId),
      });
  }

  public static getByCategoryId(id: string) {
    return Product
      .find({ categories: new Types.ObjectId(id) })
      .populate(['categories', 'productType'])
      .exec();
  }

  public static getByTypeId(id: string) {
    return Product
      .find({ productType: new Types.ObjectId(id) })
      .populate(['categories', 'productType'])
      .exec();
  }

  public static getById(id: string) {
    return Product
      .findOne({ _id: new Types.ObjectId(id) })
      .populate(['categories', 'productType'])
      .exec();
  }

  public static getAll() {
    return Product.find({}).populate(['categories', 'productType']).exec();
  }
}
