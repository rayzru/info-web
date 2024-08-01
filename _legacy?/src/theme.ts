import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#595f6d',
    },
    secondary: {
      main: '#00466f',
    },
    background: {
      default: 'transparent',
      paper: '#ffffff',
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
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        },
      }
    },
  }
});

export default theme;
