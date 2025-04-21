import "@/styles/global.css";
import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.layer.css";
import "@mantine/nprogress/styles.layer.css";
import "@mantine/spotlight/styles.layer.css";
import "@mantine/carousel/styles.layer.css";
import "@mantine/charts/styles.layer.css";

import React, { Suspense } from "react";
import { ColorSchemeScript, Loader, MantineProvider, Stack } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NavigationProgress } from "@mantine/nprogress";
import CookieDisclaimer from "@/components/CookieDisclaimer";
import { GeneralContextModal } from "@/components/GeneralContextModal";
import Header from "@/components/Header";
import ThemeColorSetter from "@/components/ThemeColorSetter";
import UserContextProvider from "@/context/UserContext";
import { HandleOnComplete } from "@/helpers/custom-router";
import { theme } from "../theme";
import classes from "./layout.module.css";

export const metadata = {
  title: "Muxout - Max you out!",
  description:
    "Become five star all around! Maximize your appearance with self-improvement routines and inspire others to do the same.",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&family=Poppins:wght@600&display=swap&subset=latin"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="bgPattern" />
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <ThemeColorSetter />
          <CookieDisclaimer />
          <Suspense
            fallback={
              <Loader
                m="auto"
                color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
              />
            }
          >
            <UserContextProvider>
              <ModalsProvider
                modals={{
                  general: GeneralContextModal,
                }}
              >
                <NavigationProgress />
                <HandleOnComplete />

                <Header />
                <Stack className={classes.container}>{children}</Stack>
              </ModalsProvider>
            </UserContextProvider>
          </Suspense>
        </MantineProvider>
      </body>
    </html>
  );
}
