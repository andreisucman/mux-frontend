"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Checkbox, Stack, Text, Title } from "@mantine/core";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import classes from "./ShowFullscreenAlert.module.css";

export default function ShowFullScreenAlert() {
  const [showFullscreenAlert, setShowFulscreenAlert] = useState(false);
  const [dontShowAlertAnymore, setDontShowAlertAnymore] = useState(false);

  const handleCloseAlert = useCallback((dontShowAlertAnymore: boolean) => {
    saveToLocalStorage("dontShowAlertAnymore", dontShowAlertAnymore);
    setShowFulscreenAlert(false);
  }, []);

  useEffect(() => {
    const dontShowAlert = getFromLocalStorage("dontShowAlertAnymore");

    if (!dontShowAlert) {
      setShowFulscreenAlert(true);
    }
  }, []);

  const fullScreenAlert = useMemo(() => {
    return (
      <Alert
        className={classes.fullScreenAlert}
        withCloseButton
        onClose={() => handleCloseAlert(dontShowAlertAnymore)}
      >
        <Stack>
          <Title order={5}>To exit fullscreen mode</Title>
          <Text size="sm">Swipe your finger down from the beginning of your screen.</Text>
          <Checkbox
            checked={dontShowAlertAnymore}
            onChange={(e) => setDontShowAlertAnymore(e.currentTarget.checked)}
            label="Don't show this anymore"
          />
        </Stack>
      </Alert>
    );
  }, [dontShowAlertAnymore]);
  return <>{showFullscreenAlert && fullScreenAlert}</>;
}
