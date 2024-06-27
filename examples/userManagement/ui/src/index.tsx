import React from 'react';
import ReactDOM from 'react-dom/client';
import Tasks from './apps/dashboard';
import {Blueprint} from "blueprint-react";
import {createTheme, PaletteOptions, ThemeProvider} from '@mui/material/styles';
import {TypographyOptions} from "@mui/material/styles/createTypography";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// theme.ts
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#424242', // Darker grey header
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#e0e0e0', // Lighter grey sidebar
          color: '#000000',
          width: 240,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          backgroundColor: '#424242', // Darker grey buttons
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#616161', // Slightly lighter grey on hover
          },
        },
      },
    },
  },
});


root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Blueprint uri={process.env.REACT_APP_URI}>
        <Tasks />
      </Blueprint>
    </ThemeProvider>
  </React.StrictMode>
);