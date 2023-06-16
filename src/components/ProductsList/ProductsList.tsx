import ProductCard from '@/components/ProductsList/ProductCard';
import { useCartContext } from '@/context/cartContext';
import { ProductItemPreview } from '@/interfaces/product/product';
import styles from '@/styles/modules/Webshop.module.scss';

export default function ProductsList(
  { products, categoryName, isMiniView, isCentered = true }:
    { products: ProductItemPreview[], categoryName?: string, isMiniView?: boolean, isCentered?: boolean },
) {
  const { addItems } = useCartContext();

  const addToCart = (e: MouseEvent, product: ProductItemPreview) => {
    e.preventDefault();
    addItems(product);
  };

  if (!products.length) {
    return <div>No products found</div>;
  }

  return (
    <div className={`
      ${styles.products} 
      ${styles[`products${products.length}`]}
      ${isMiniView ? styles.productsMini : ''}
      ${isCentered ? styles.productsCentered : ''}
    `}>
      {products.map((product: ProductItemPreview) => (
        <ProductCard
          onAddToCart={addToCart}
          categoryName={categoryName || product.categories[0].name}
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
}
