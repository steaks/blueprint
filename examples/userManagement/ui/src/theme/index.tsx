import {ReactNode, useMemo} from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import {Components, createTheme, ThemeOptions, ThemeProvider as MUIThemeProvider} from '@mui/material/styles';

import { palette } from './palette';
import { shadows } from './shadows';
import { overrides } from './overrides';
import { typography } from './typography';
import { customShadows } from './custom-shadows';
import PropTypes from "prop-types";

// ----------------------------------------------------------------------

export default function ThemeProvider(p: { readonly children: ReactNode; }) {
  const memoizedValue = useMemo(
    () => ({
      palette: palette(),
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
      shape: { borderRadius: 8 },
    }),
    []
  );

  const theme = createTheme(memoizedValue as unknown as ThemeOptions);

  theme.components = overrides(theme) as Components<any>;

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {p.children}
    </MUIThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
