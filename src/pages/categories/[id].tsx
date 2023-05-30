import CategoryList from '@/components/Category';
import { Product, ProductItemPreview } from '@/interfaces/product/product';
import CategoryService from '@/services/category.service';
import ProductService from '@/services/product.service';
import ReviewService from '@/services/review.service';
import dbConnect from '@/utils/db';

export const getServerSideProps = async ({ params }: { params: { id: string } }) => {
  await dbConnect();

  const category = await CategoryService.getById(params.id);
  const products = ProductService.toPreview(
    await ProductService.getByCategoryId(params.id) as Product[],
  );
  const ratedProducts = await ReviewService.mapRatingsToProducts(products as ProductItemPreview[]);

  return {
    props: {
      products: JSON.parse(JSON.stringify(ratedProducts)),
      categoryName: category?.name,
    },
  };
};

const Category = CategoryList;
export default Category;
