"use client";

import { createTheme, MantineColorsTuple, rem } from "@mantine/core";

const red: MantineColorsTuple = [
  "#ffe9e9",
  "#ffd1d1",
  "#fba0a1",
  "#f76d6d",
  "#f34141",
  "#f22625",
  "#f21616",
  "#d8070b",
  "#c10008",
  "#a90003",
];

const green: MantineColorsTuple = [
  "#e6ffee",
  "#d3f9e0",
  "#a8f2c0",
  "#7aea9f",
  "#54e382",
  "#3bdf70",
  "#2bdd66",
  "#1bc455",
  "#0bae4a",
  "#00973c",
];

const orange: MantineColorsTuple = [
  "#fff4e1",
  "#ffe8cc",
  "#fed09b",
  "#fdb766",
  "#fca13a",
  "#fc931d",
  "#fc8c0c",
  "#e17800",
  "#c86a00",
  "#af5a00",
];

const brand: MantineColorsTuple = [
  "#ffeaee",
  "#fcd5d8",
  "#f1a9b0",
  "#e97b84",
  "#e25360",
  "#dd3a48",
  "#dc2d3c",
  "#c41f2e",
  "#b01728",
  "#9a0b20",
];

export const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  defaultRadius: 16,
  colors: { red, green, orange, brand },
  black: "#2e2e2d",
  primaryColor: "brand",
  primaryShade: 6,
  autoContrast: true,
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
  },
  shadows: { md: "4px 8px 16px 0 rgba(0, 0, 0, 0.1)", sm: "2px 4px 8px 0 rgba(0, 0, 0, 0.1)" },
  headings: {
    fontFamily: "Poppins",
    fontWeight: "600",
    textWrap: "wrap",
    sizes: {
      h1: { fontSize: rem(26) },
      h2: { fontSize: rem(22) },
      h3: { fontSize: rem(20) },
      h4: { fontSize: rem(18) },
      h5: { fontSize: rem(16) },
    },
  },

  cursorType: "pointer",
});
