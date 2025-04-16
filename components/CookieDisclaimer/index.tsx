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
  const savedConsent = getFromLocalStorage("cookieConsent");

  const handleDecide = (verdict: boolean) => {
    setHasConsent(verdict);
    setShowBanner(false);
    saveToLocalStorage("cookieConsent", verdict);

    if (!verdict && window.clarity) {
      Clarity.consent(false);
    }
  };

  useEffect(() => {
    Clarity.init(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID!);
  }, [hasConsent]);

  useEffect(() => {
    if (savedConsent === true || savedConsent === false) {
      setHasConsent(savedConsent);
    } else {
      callTheServer({ endpoint: "getIsFromEu", method: "GET" }).then((res) => {
        if (res.status === 200) {
          setShowBanner(res.message);
        }
      });
    }
  }, [savedConsent]);

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
