const plugin = require("tailwindcss/plugin");
const { colors: tailwindColors } = require("tailwindcss/defaultTheme");
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette")
  .default;

const colors = {
  "midnight-blue": {
    50: "#F3F5F8",
    100: "#E6EBF0",
    200: "#C1CDDA",
    300: "#9BAFC4",
    400: "#507497",
    500: "#05386B",
    600: "#053260",
    700: "#032240",
    800: "#021930",
    900: "#021120",
  },
  emerald: {
    50: "#F7FDFA",
    100: "#EFFBF4",
    200: "#D6F6E5",
    300: "#BEF1D5",
    400: "#8DE6B5",
    500: "#5CDB95",
    600: "#53C586",
    700: "#378359",
    800: "#296343",
    900: "#1C422D",
  },
};

module.exports = {
  purge: ["./src/**/*.js"],
  theme: {
    colors: {
      transparent: "transparent",
      primary: colors.emerald[500],
      primaryVariant: colors.emerald[700],
      secondary: colors["midnight-blue"][500],
      secondaryVariant: colors["midnight-blue"][700],
      white: "#FFFFFF",
      dark: "#212121",
      overPrimary: colors["midnight-blue"][500],
      overSecondary: "#FFFFFF",
      grey: "#4A4A4A",
      greyLight: "#737373",
      primaryLight: colors.emerald[200],
      danger: tailwindColors.red[500],
      dangerVariant: tailwindColors.red[700],
      dangerLight: tailwindColors.red[200],
    },
    container: {
      center: true,
      padding: {
        default: "1.5rem",
      },
    },
    extend: {
      boxShadow: {
        outline: "0 0 0 2px rgba(92, 219, 149, 0.3)",
        outlineReverse: "0 0 0 2px rgba(5, 56, 107, 0.3)",
      },
      maxWidth: {
        "1/2": "50%",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      const themeColors = flattenColorPalette(theme("borderColor"));

      const individualBorderColors = Object.keys(themeColors).map(
        colorName => ({
          [`.border-b-${colorName}`]: {
            borderBottomColor: themeColors[colorName],
          },
          [`.border-t-${colorName}`]: {
            borderTopColor: themeColors[colorName],
          },
          [`.border-l-${colorName}`]: {
            borderLeftColor: themeColors[colorName],
          },
          [`.border-r-${colorName}`]: {
            borderRightColor: themeColors[colorName],
          },
        })
      );

      addUtilities(individualBorderColors, ["hover"]);
    }),
  ],
  variants: {},
};
