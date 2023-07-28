import { Product } from '@/interfaces/product/product';
import CategoryService from '@/services/category.service';
import ProductService from '@/services/product.service';
import dbConnect from '@/utils/db';
import { isValidObjectId } from 'mongoose';
import dynamic from 'next/dynamic';

export const getServerSideProps = async ({ params }: { params: { id: string } }) => {
  await dbConnect();

  if (!isValidObjectId(params.id)) {
    return {
      notFound: true,
    };
  }

  const category = await CategoryService.getById(params.id);
  if (!category) {
    return {
      notFound: true,
    };
  }
  const products = ProductService.toPreview(
    await ProductService.getByCategoryId(params.id) as Product[],
  );

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      category: JSON.parse(JSON.stringify(category)),
    },
  };
};

const Category = dynamic(() => import('@/components/Category').then((mod) => mod.default));
export default Category;
