import { createMuiTheme } from '@material-ui/core/styles';

const titleFont = ['"Pridi"', 'serif'].join(',')
const bodyFont = ['"Noto Sans"', 'sans-serif'].join(',')

const HumanTheme = createMuiTheme({
  typography: {
    fontFamily: bodyFont,
  },
  h1: {
    fontFamily: titleFont,
  },
  h2: {
    fontFamily: titleFont,
  },
  h3: {
    fontFamily: titleFont,
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
});

export default HumanTheme;