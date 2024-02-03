import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff0000',
      dark: '#ff0000',
    },
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
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#00000033',
        },
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
