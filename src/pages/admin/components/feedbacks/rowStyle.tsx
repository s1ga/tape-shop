import { useTheme } from '@mui/material/styles';
import { Identifier } from 'react-admin';
import green from '@mui/material/colors/green';
import orange from '@mui/material/colors/orange';
import { ContactFeedback } from '@/interfaces/contactFeedback';

const rowStyle = (selectedRow?: Identifier) => (record: ContactFeedback) => {
  const theme = useTheme();
  let style = {};
  if (!record) {
    return style;
  }
  if (selectedRow && selectedRow === record.id) {
    style = {
      ...style,
      backgroundColor: theme.palette.action.selected,
    };
  }
  if (record.reviewed) {
    return {
      ...style,
      borderLeftColor: green[500],
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
    };
  }
  if (!record.reviewed) {
    return {
      ...style,
      borderLeftColor: orange[500],
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
    };
  }
  // if (record.status === 'rejected') {
  // return {
  //   ...style,
  //   borderLeftColor: red[500],
  //   borderLeftWidth: 5,
  //   borderLeftStyle: 'solid',
  // };
  // }
  return style;
};

export default rowStyle;
