import { createTheme } from '@mui/material/styles';
import { Admin, Resource, defaultTheme } from 'react-admin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faCartShopping, faComment, faMessage, faTag } from '@fortawesome/free-solid-svg-icons';
import adminResourceMap from '@/constants/admin-resources';
import authProvider from '@/context/adminAuthProvider';
import dataProvider from '@/context/adminDataProvider';
import categories from './categories';
import types from './types';
import feedbacks from './feedbacks';
import products from './products';
import reviews from './reviews';

const resourceIcons = {
  products: () => <FontAwesomeIcon icon={faCartShopping} />,
  categories: () => <FontAwesomeIcon icon={faBookmark} />,
  types: () => <FontAwesomeIcon icon={faTag} />,
  contactFeedbacks: () => <FontAwesomeIcon icon={faMessage} />,
  reviews: () => <FontAwesomeIcon icon={faComment} />,
};

const theme = createTheme(
  {
    ...defaultTheme,
    palette: {
      secondary: {
        main: '#383838',
      },
    },
  },
);

export default function AdminPage() {
  return (
    <Admin
      basename="/admin"
      dataProvider={dataProvider}
      authProvider={authProvider}
      theme={theme}
      requireAuth
    >
      <Resource name={adminResourceMap.products} {...products} icon={resourceIcons.products} />
      <Resource name={adminResourceMap.categories} {...categories} icon={resourceIcons.categories} />
      <Resource name={adminResourceMap.types} {...types} icon={resourceIcons.types} />
      <Resource name={adminResourceMap.feedback} {...feedbacks} icon={resourceIcons.contactFeedbacks} />
      <Resource name={adminResourceMap.reviews} {...reviews} icon={resourceIcons.reviews} />
    </Admin>
  );
}
