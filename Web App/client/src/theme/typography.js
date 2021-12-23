function pxToRem(value) {
  return `${value / 16}rem`;
}

function responsiveFontSizes({ xs, sm, md, lg }) {
  return {
    "@media (min-width:0px)": {
      fontSize: pxToRem(xs)
    },
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
    ...responsiveFontSizes({ xs: 45, sm: 49, md: 58, lg: 70 })
  },
  h2: {
    fontWeight: 300,
    lineHeight: 1.2,
    fontSize: pxToRem(60),
    ...responsiveFontSizes({ xs: 36, sm: 40, md: 44, lg: 52 })
  },
  h3: {
    fontWeight: 300,
    lineHeight: 1.167,
    fontSize: pxToRem(48),
    ...responsiveFontSizes({ xs: 23, sm: 26, md: 30, lg: 37 })
  },
  h4: {
    fontWeight: 300,
    lineHeight: 1.235,
    fontSize: pxToRem(30),
    ...responsiveFontSizes({ xs: 20, sm: 20, md: 26, lg: 30 })
  },
  h5: {
    fontWeight: 300,
    lineHeight: 1.334,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ xs: 19, sm: 19, md: 20, lg: 24 })
  },
  h6: {
    fontWeight: 300,
    lineHeight: 1.6,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ xs: 16, sm: 16, md: 19, lg: 20 })
  },
  subtitle1: {
    fontWeight: 400,
    lineHeight: 1.75,
    fontSize: pxToRem(14)
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 1.57,
    fontSize: pxToRem(14)
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(15)
  },
  body2: {
    lineHeight: 1.43,
    fontSize: pxToRem(13)
  },
  button: {
    fontWeight: 500,
    lineHeight: 1.75,
    fontSize: pxToRem(13),
    textTransform: "uppercase"
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(11)
  },
  overline: {
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(10),
    textTransform: "uppercase"
  },
};

export default typography;
