import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';

// ##############################
// // // Function that converts from hex color to rgb color
// // // Example: input = #9c27b0 => output = 156, 39, 176
// // // Example: input = 9c27b0 => output = 156, 39, 176
// // // Example: input = #999 => output = 153, 153, 153
// // // Example: input = 999 => output = 153, 153, 153
// #############################
// const hexToRgb = input => {
//   input = input + "";
//   input = input.replace("#", "");
//   let hexRegex = /[0-9A-Fa-f]/g;
//   if (!hexRegex.test(input) || (input.length !== 3 && input.length !== 6)) {
//     throw new Error("input is not a valid hex color.");
//   }
//   if (input.length === 3) {
//     let first = input[0];
//     let second = input[1];
//     let last = input[2];
//     input = first + first + second + second + last + last;
//   }
//   input = input.toUpperCase(input);
//   let first = input[0] + input[1];
//   let second = input[2] + input[3];
//   let last = input[4] + input[5];
//   return (
//     parseInt(first, 16) +
//     ", " +
//     parseInt(second, 16) +
//     ", " +
//     parseInt(last, 16)
//   );
// };

const titleFont = ['"Pridi"', 'serif'].join(',');
const bodyFont = ['"Noto Sans"', 'sans-serif'].join(',');
const extraSansFont = ['"Roboto"', 'sans-serif'].join(',');

// See the default:
// https://material-ui.com/customization/default-theme/
// https://material-ui.com/customization/color/#color-tool
// Pink 300
// Purple 400
//
const humanTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: {
        main: pink[300],
      },
      secondary: {
        main: indigo[400],
      },
    },
    typography: {
      fontFamily: bodyFont,
      h1: {
        fontSize: '3rem',
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
      subtitle1: {
        fontFamily: extraSansFont,
      },
      subtitle2: {
        fontFamily: extraSansFont,
      },
      body1: {
        
      },
      body2: {},
      button: {},
      caption: {},
      overline: {},
    },
    overrides: {
      MuiTypography: {
        body1: {
          marginTop: '1rem',
          marginBottom: '.5rem',
        }
      },
    },
  })
);

export { titleFont, bodyFont };

export default humanTheme;
