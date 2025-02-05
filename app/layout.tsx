import "@/styles/global.css";
import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.layer.css";
import "@mantine/nprogress/styles.layer.css";
import "@mantine/spotlight/styles.layer.css";
import "@mantine/carousel/styles.layer.css";

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
  title: "Muxout - Max You Out!",
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
        <div className="bgPattern" />
        <MantineProvider theme={theme} defaultColorScheme="dark" forceColorScheme="dark">
          <Suspense fallback={<Loader m="auto" />}>
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
