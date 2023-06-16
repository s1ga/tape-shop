import { Button } from '@mui/material';
import { Create, SaveButton, Toolbar, useRedirect } from 'react-admin';
import { NewProductItem } from '@/interfaces/product/product';
import { ProductItemAdditional } from '@/interfaces/product/productAdditional';
import resourceMap from '../../constants/resources';
import ProductForm from './Form';

export default function ProductCreate() {
  return (
    <Create>
      <ProductForm>
        <EditToolbar />
      </ProductForm>
    </Create >
  );
}

function EditToolbar(props: any) {
  const redirect = useRedirect();

  const transform = (record: NewProductItem) => {
    const updated = { ...record };
    if (!record.demo?.description && !record.demo?.video) {
      updated.demo = undefined;
    }
    if (record.features?.features?.length) {
      updated.features!.features = record.features.features
        .filter((r: Record<string, string>) => r.key && r.value);
    }
    updated.additionalInformation = record.additionalInformation
      ?.filter((i: ProductItemAdditional) => i.caption && i.value);
    updated.characteristics.items = (record.characteristics.items as any[])
      .map(({ field }) => field);
    updated.images = record.images.map((obj: any) => obj.rawFile);
    return updated;
  };

  return (
    <Toolbar {...props} sx={{ display: 'flex', columnGap: '16px' }}>
      <SaveButton type="button" transform={transform} />
      <Button color="primary" onClick={() => redirect(`/${resourceMap.products}`)}>Back</Button>
    </Toolbar>
  );
}
