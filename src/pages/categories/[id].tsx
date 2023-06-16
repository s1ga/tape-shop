import CategoryList from '@/components/Category';
import { Product } from '@/interfaces/product/product';
import CategoryService from '@/services/category.service';
import ProductService from '@/services/product.service';
import dbConnect from '@/utils/db';
import { isValidObjectId } from 'mongoose';

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
      categoryName: category?.name,
    },
  };
};

const Category = CategoryList;
export default Category;
