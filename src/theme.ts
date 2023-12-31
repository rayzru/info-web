import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      default: '#f7f8ec'
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
      defaultProps: {
        variant: 'elevation',
        elevation: 0
      }
    },
  }
});

export default theme;
