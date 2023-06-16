import createMuiTheme from '@mui/material/styles/createTheme';
import { Admin, Resource, defaultTheme } from 'react-admin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faCartShopping, faComment, faMessage, faTag } from '@fortawesome/free-solid-svg-icons';
import authProvider from '../providers/auth';
import categories from './categories';
import types from './types';
import feedbacks from './feedbacks';
import products from './products';
import reviews from './reviews';
import dataProvider from '../providers/data';
import resourceMap from '../constants/resources';

const resourceIcons = {
  products: () => <FontAwesomeIcon icon={faCartShopping} />,
  categories: () => <FontAwesomeIcon icon={faBookmark} />,
  types: () => <FontAwesomeIcon icon={faTag} />,
  contactFeedbacks: () => <FontAwesomeIcon icon={faMessage} />,
  reviews: () => <FontAwesomeIcon icon={faComment} />,
};

const theme = createMuiTheme(
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
      <Resource name={resourceMap.products} {...products} icon={resourceIcons.products} />
      <Resource name={resourceMap.categories} {...categories} icon={resourceIcons.categories} />
      <Resource name={resourceMap.types} {...types} icon={resourceIcons.types} />
      <Resource name={resourceMap.feedback} {...feedbacks} icon={resourceIcons.contactFeedbacks} />
      <Resource name={resourceMap.reviews} {...reviews} icon={resourceIcons.reviews} />
    </Admin>
  );
}
