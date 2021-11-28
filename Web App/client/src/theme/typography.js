function pxToRem(value) {
  return `${value / 16}rem`;
}

function responsiveFontSizes({ sm, md, lg }) {
  return {
    "@media (min-width:600px)": {
      fontSize: pxToRem(sm)
    },
    "@media (min-width:900px)": {
      fontSize: pxToRem(md)
    },
    "@media (min-width:1200px)": {
      fontSize: pxToRem(lg)
    }
  };
}

const typography = {
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontWeight: 300,
    lineHeight: 1.167,
    fontSize: pxToRem(96),
    // ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 })
  },
  h2: {
    fontWeight: 300,
    lineHeight: 1.2,
    fontSize: pxToRem(60),
    // ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 })
  },
  h3: {
    fontWeight: 300,
    lineHeight: 1.167,
    fontSize: pxToRem(48),
    // ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 })
  },
  h4: {
    fontWeight: 300,
    lineHeight: 1.235,
    fontSize: pxToRem(34),
    // ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 })
  },
  h5: {
    fontWeight: 300,
    lineHeight: 1.334,
    fontSize: pxToRem(24),
    // ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 })
  },
  h6: {
    fontWeight: 300,
    lineHeight: 1.6,
    fontSize: pxToRem(20),
    // ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 })
  },
  subtitle1: {
    fontWeight: 400,
    lineHeight: 1.75,
    fontSize: pxToRem(16)
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 1.57,
    fontSize: pxToRem(14)
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16)
  },
  body2: {
    lineHeight: 1.43,
    fontSize: pxToRem(14)
  },
  button: {
    fontWeight: 500,
    lineHeight: 1.75,
    fontSize: pxToRem(14),
    textTransform: "uppercase"
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12)
  },
  overline: {
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: "uppercase"
  },
};

export default typography;