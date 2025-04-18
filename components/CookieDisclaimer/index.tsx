"use client";

import React, { useEffect, useState } from "react";
import Clarity from "@microsoft/clarity";
import { GoogleTagManager } from "@next/third-parties/google";
import { Button, Group, Text } from "@mantine/core";
import callTheServer from "@/functions/callTheServer";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import classes from "./CookieDisclaimer.module.css";

export default function CookieDisclaimer() {
  const [showBanner, setShowBanner] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  const handleDecide = (verdict: boolean) => {
    saveToLocalStorage("cookieConsent", verdict);
    setHasConsent(verdict);
    setShowBanner(false);
    Clarity.consent(verdict);
  };

  useEffect(() => {
    Clarity.init(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID!);
    const savedConsent = getFromLocalStorage("cookieConsent") as boolean | null;

    if (savedConsent !== null) {
      setHasConsent(savedConsent);
      setShowBanner(false);
      Clarity.consent(savedConsent);
    } else {
      callTheServer({ endpoint: "getIsFromEu", method: "GET" })
        .then((res) => {
          if (res.status === 200) {
            setShowBanner(res.message === true);
          }
        })
        .catch(() => setShowBanner(true));
    }
  }, []);

  return (
    <>
      {hasConsent && process.env.NEXT_PUBLIC_ENV !== "dev" && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
      )}
      {showBanner && (
        <>
          <Group className={classes.container}>
            <Group className={`${classes.wrapper} mediumPage`}>
              <Text className={classes.text}>
                We use cookies to understand how you use our site and enable account functionality.
                Do you consent to the use of these cookies?
              </Text>
              <Group className={classes.buttons}>
                <Button onClick={() => handleDecide(true)}>Yes</Button>
                <Button variant="default" onClick={() => handleDecide(false)}>
                  No
                </Button>
              </Group>
            </Group>
          </Group>
        </>
      )}
    </>
  );
}
