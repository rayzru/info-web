import { createTheme } from '@mui/material';
import { grey, red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: grey[100],
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
      defaultProps: {
        variant: 'outlined'
      }
    },
  }
});

export default theme;
