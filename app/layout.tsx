import "@/styles/mantine.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/nprogress/styles.css";
import "@/styles/global.css";

import React, { Suspense } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { ColorSchemeScript, Loader, MantineProvider, Stack } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NavigationProgress } from "@mantine/nprogress";
import { GeneralContextModal } from "@/components/GeneralContextModal";
import Header from "@/components/Header";
import UserContextProvider from "@/context/UserContext";
import { HandleOnComplete } from "@/helpers/custom-router";
import { theme } from "../theme";
import classes from "./layout.module.css";

export const metadata = {
  title: "Max You Out",
  description: "Become five star all around!",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript forceColorScheme="dark" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Poppins:wght@600&display=swap&subset=latin"
          rel="stylesheet"
        />
      </head>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark" forceColorScheme="dark">
          <Suspense fallback={<Loader m="auto" />}>
            <ModalsProvider
              modals={{
                general: GeneralContextModal,
              }}
            >
              <NavigationProgress />
              <HandleOnComplete />

              <>
                <UserContextProvider>
                  <Header />
                </UserContextProvider>

                <Stack className={classes.container}>{children}</Stack>
              </>
            </ModalsProvider>
          </Suspense>
        </MantineProvider>
      </body>
    </html>
  );
}
