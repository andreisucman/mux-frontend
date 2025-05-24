import { loadConnectAndInitialize } from "@stripe/connect-js";

type ConnectAppearance = Parameters<typeof loadConnectAndInitialize>[0]["appearance"];

export function makeStripeAppearance(isDark: boolean): ConnectAppearance {
  return {
    overlays: "dialog",
    variables: isDark
      ? {
          colorBackground: "#272727",
          colorText: "#c9c9c9",
          colorSecondaryText: "#B5B5B5",
          colorPrimary: "#dc2d3c",
          borderRadius: "16px",
          fontFamily: "Open Sans, sans-serif",
          overlayBackdropColor: "#242424",
          buttonSecondaryColorBackground: "#B5B5B5",
          colorBorder: "#272727",
        }
      : {
          colorBackground: "#f8f9fa",
          colorText: "#2e2e2d",
          colorSecondaryText: "#717171",
          colorPrimary: "#dc2d3c",
          borderRadius: "16px",
          fontFamily: "Open Sans, sans-serif",
          overlayBackdropColor: "#ffffff",
          buttonSecondaryColorBackground: "#FFFFFF",
          colorBorder: "#f8f9fa",
        },
  };
}
