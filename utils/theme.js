const fontFamilyBase =
  'METAB, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';
const fontSizeBase = 1.6;
const lineHeightBase = 1.5;
const baseline = fontSizeBase * lineHeightBase;
const breakpoints = ["30em", "48em", "62em", "80em"];

breakpoints.sm = breakpoints[0];
breakpoints.md = breakpoints[1];
breakpoints.lg = breakpoints[2];
breakpoints.xl = breakpoints[3];

const customTheme = {
  colors: {
    orange: {
      50: "#FFF3F0",
      100: "#FFE4DB",
      200: "#FFC5B2",
      300: "#FFA68A",
      400: "#FF8761",
      500: "#FF6838",
      600: "#FF3D00",
      700: "#C73000",
      800: "#8F2200",
      900: "#571500",
    },
    customBlue: {
      50: "#D8DFFD",
      100: "#C5CEFC",
      200: "#9EADFA",
      300: "#778DF9",
      400: "#506CF7",
      500: "#294BF5",
      600: "#0A2DDC",
      700: "#0822A6",
      800: "#051770",
      900: "#030C3B",
    },
    customGray: {
      50: "#7E7E7E",
      100: "#747474",
      200: "#5F5F5F",
      300: "#4B4B4B",
      400: "#363636",
      500: "#222222",
      600: "#060606",
      700: "#000000",
      800: "#000000",
      900: "#000000",
    },
  },
  breakpoints,
  fonts: {
    heading: fontFamilyBase,
    body: fontFamilyBase,
    mono: 'METAB, source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
  },
  fontSizes: {
    xs: "1.2rem",
    sm: "1.4rem", // h6
    md: "1.6rem", // h5
    lg: "1.8rem", // h4
    xl: "2rem", // h3
    "2xl": "2.4rem", // h2
    "3xl": "3rem", // h1
    "4xl": "3.6rem",
    "5xl": "4.2rem",
    "6xl": "5rem",
  },
  sizes: {
    container: {
      xl: "110rem",
    },
  },
  space: {
    xs: `${baseline / 3}rem`,
    sm: `${baseline / 2}rem`,
    md: `${baseline}rem`, // 2.4rem
    lg: `${baseline * 2}rem`,
    xl: `${baseline * 3}rem`,
    "2xl": `${baseline * 4}rem`,
  },
};

export default customTheme;
