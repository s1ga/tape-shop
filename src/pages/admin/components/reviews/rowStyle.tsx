import { useTheme } from '@mui/material/styles';
import { FullReview } from '@/interfaces/review';
import { Identifier } from 'react-admin';
import green from '@mui/material/colors/green';
import red from '@mui/material/colors/red';
import orange from '@mui/material/colors/orange';

const rowStyle = (selectedRow?: Identifier) => (record: FullReview) => {
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
  if (!record.isChecked) {
    return {
      ...style,
      borderLeftColor: orange[500],
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
    };
  }
  if (record.isChecked && record.isApproved) {
    return {
      ...style,
      borderLeftColor: green[500],
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
    };
  }
  if (record.isChecked && !record.isApproved) {
    return {
      ...style,
      borderLeftColor: red[500],
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
    };
  }
  return style;
};

export default rowStyle;
