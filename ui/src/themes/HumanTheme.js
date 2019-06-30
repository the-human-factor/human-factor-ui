import { createMuiTheme } from '@material-ui/core/styles';

const titleFont = ['"Pridi"', 'serif'].join(',')
const bodyFont = ['"Noto Sans"', 'sans-serif'].join(',')

// See the default:
// https://material-ui.com/customization/default-theme/

const HumanTheme = createMuiTheme({
  typography: {
    fontFamily: bodyFont,
    h1: {
      fontFamily: titleFont,
      fontSize: '3rem',
    },
    h2: {
      fontFamily: titleFont,
      fontSize: '2rem',
    },
    h3: {
      fontFamily: titleFont,
      fontSize: '1rem',
    },
    h4: {
      fontFamily: titleFont,
    },
    h5: {
      fontFamily: titleFont,
    },
    h6: {
      fontFamily: titleFont,
    },
  },
});

export default HumanTheme;