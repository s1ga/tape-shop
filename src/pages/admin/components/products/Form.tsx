import imagesMimeTypes from '@/constants/mimeTypes';
import { Grid, InputAdornment, Tooltip } from '@mui/material';
import {
  ArrayInput, ImageField, ImageInput, Labeled,
  NumberInput, RecordContextProvider, ReferenceArrayInput,
  SelectArrayInput, SelectInput, SimpleFormIterator, TabbedForm,
  TextInput, minLength, required, useRecordContext,
} from 'react-admin';
import { ReactElement } from 'react';
import { Product } from '@/interfaces/product/product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import resourceMap from '../../constants/resources';

const req: any[] = [required()];
const reqWithMinLength = [...req, minLength(3, 'Should be at least 3 characters')];
const nonZeroValidation = (value: number) => {
  if (value <= 0) {
    return 'Price should be greater than 0';
  }
  return undefined;
};

export default function ProductForm({ children }: { children: ReactElement }) {
  const record = useRecordContext<Product>();
  let context: any;

  if (record) {
    context = {
      ...record,
      images: typeof record.images[0] === 'string'
        ? record.images.map((src: string) => ({ id: src, src }))
        : record.images,
      productType: typeof record?.productType === 'string'
        ? record.productType
        : record?.productType[0]._id,
      features: record.features
        ? { ...record.features, image: { id: record.features.image, src: record.features.image } }
        : record.features,
    };
  }

  return (
    <RecordContextProvider value={context || record}>
      <TabbedForm
        sanitizeEmptyValues
        warnWhenUnsavedChanges
        toolbar={children}
        defaultValues={{ availability: 0 }}
      >
        <TabbedForm.Tab label="Main info">
          <Grid container columnSpacing={2}>
            <Grid item xs={12} sm={6}>
              <TextInput source="name" fullWidth validate={reqWithMinLength} />
            </Grid>
            <Grid item xs={0} sm={6} />
            <Grid item xs={12} sm={6}>
              <TextInput source="sku" fullWidth validate={reqWithMinLength} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <NumberInput
                source="price"
                validate={req.concat(nonZeroValidation)}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid
              item xs={12} sm={3}
              sx={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}
            >
              <NumberInput
                source="availability"
                fullWidth
              />
              <Tooltip
                title="Put 0 if there is no products in stock, leave input without any number to
                indicate no information for availability"
              >
                <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faCircleInfo} />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextInput
                source="description"
                validate={reqWithMinLength}
                multiline
                fullWidth
              />
            </Grid>
          </Grid>
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Images" path="images">
          <ImageInput
            validate={req}
            source="images"
            accept={imagesMimeTypes.join(',')}
            multiple
          >
            <ImageField
              source="src"
              sx={{ '& .RaImageField-image': { width: '240px', height: 'auto', aspectRatio: 1 } }}
            />
          </ImageInput>
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Characteristics" path="characteristics">
          <Grid container rowSpacing={2}>
            <Grid item xs={12} sm={5}>
              <TextInput fullWidth source="characteristics.phrase" validate={req} />
            </Grid>
            <Grid item xs={0} sm={5} />
            <Grid item xs={12} sm={7}>
              <ArrayInput fullWidth validate={req} source="characteristics.items">
                <SimpleFormIterator fullWidth inline>
                  <TextInput validate={req} source="field" fullWidth />
                </SimpleFormIterator>
              </ArrayInput>
            </Grid>
          </Grid>
        </TabbedForm.Tab>
        <TabbedForm.Tab label="References" path="references">
          <ReferenceArrayInput validate={req} source="categories" reference={resourceMap.categories}>
            <SelectArrayInput validate={req} />
          </ReferenceArrayInput>
          <ReferenceArrayInput validate={req} source="productType" reference={resourceMap.types}>
            <SelectInput optionValue="_id" optionText="name" validate={req} />
          </ReferenceArrayInput>
          <ReferenceArrayInput
            source="related"
            reference={resourceMap.products}
            filter={record ? { excludeOne: record._id } : undefined}
          >
            <SelectArrayInput />
          </ReferenceArrayInput>
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Additional information" path="additional-info">
          <Labeled fullWidth label="Demo">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <TextInput source="demo.video" fullWidth />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextInput source="demo.description" fullWidth />
              </Grid>
            </Grid>
          </Labeled>

          <ArrayInput sx={{ mb: '16px' }} fullWidth source="additionalInformation">
            <SimpleFormIterator fullWidth inline>
              <TextInput source="caption" />
              <TextInput source="value" />
            </SimpleFormIterator>
          </ArrayInput>

          <Labeled label="Features">
            <>
              <ImageInput
                source={record ? 'features.image' : 'featureImage'}
                accept={imagesMimeTypes.join(',')}
              >
                <ImageField
                  source="src"
                  sx={{ '& .RaImageField-image': { width: '240px', height: 'auto', aspectRatio: 1 } }}
                />
              </ImageInput>
              <ArrayInput fullWidth source="features.features">
                <SimpleFormIterator fullWidth inline>
                  <TextInput source="key" />
                  <TextInput source="value" />
                </SimpleFormIterator>
              </ArrayInput>
            </>
          </Labeled>
        </TabbedForm.Tab>
      </TabbedForm>
    </RecordContextProvider>
  );
}
