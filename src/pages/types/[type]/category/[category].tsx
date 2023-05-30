import ProductService from '@/services/product.service';
import TypeService from '@/services/type.service';
import { ProductItemPreview } from '@/interfaces/product/product';
import { Category as ICategory } from '@/interfaces/category';
import ReviewService from '@/services/review.service';
import CategoryList from '@/components/Category';
import dbConnect from '@/utils/db';

type Params = {
  params: {
    type: string;
    category: string;
  }
}

export const getServerSideProps = async ({ params }: Params) => {
  await dbConnect();

  const type = await TypeService.findById(params.type);
  const categoryName = type.categories.find((c: ICategory) => c._id.toString() === params.category)?.name;
  const products = ProductService.toPreview(
    await ProductService.getByTypeCategories(type._id, params.category),
  );
  const ratedProducts = await ReviewService.mapRatingsToProducts(products as ProductItemPreview[]);

  return {
    props: {
      products: JSON.parse(JSON.stringify(ratedProducts)),
      categoryName,
    },
  };
};

const TypeCategory = CategoryList;
export default TypeCategory;
