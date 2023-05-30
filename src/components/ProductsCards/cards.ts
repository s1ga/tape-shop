import productTypes from '@/constants/productTypes';
import { ProductTypeCard } from '@/interfaces/productTypeCard';

export default function getCardsText(isHomePage: boolean = false): Partial<ProductTypeCard>[] {
  return [
    {
      id: productTypes.TapeDispensers,
      text: isHomePage
        ? `Available in different bandwidth sizes: 24/25, 36 and 38 mm. Easy and accurate appliance. 
        Straight lines and precisely cut in the corner. Fit for most tape brands.`
        : `With the QuiP® tape dispenser masking tape can be applied accurately 
        and tape precisely cut in the corner. Works 3 - 4 times faster and more precise.`,
    },
  ];
}
