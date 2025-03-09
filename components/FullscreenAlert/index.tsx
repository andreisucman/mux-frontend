"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Checkbox, Stack, Text, Title } from "@mantine/core";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import classes from "./FullscreenAlert.module.css";

type Props = {
  withCheckbox?: boolean;
  withCloseButton?: boolean;
  forceShowAlert?: boolean;
  customStyles?: { [key: string]: any };
};

export default function FullScreenAlert({
  withCheckbox,
  withCloseButton,
  forceShowAlert,
  customStyles,
}: Props) {
  const [showFullscreenAlert, setShowFulscreenAlert] = useState(forceShowAlert);
  const [dontShowAlertAnymore, setDontShowAlertAnymore] = useState(false);

  const handleCloseAlert = useCallback((dontShowAlertAnymore: boolean) => {
    saveToLocalStorage("dontShowAlertAnymore", dontShowAlertAnymore);
    setShowFulscreenAlert(forceShowAlert || false);
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
        className={classes.container}
        style={customStyles || {}}
        onClose={() => handleCloseAlert(dontShowAlertAnymore)}
        withCloseButton={withCloseButton}
        variant="filled"
      >
        <Stack>
          <Title order={5}>To exit the full screen mode</Title>
          <Text size="sm">
            Swipe your finger up from the <u>bottom</u> of your
            screen.
          </Text>
          {withCheckbox && (
            <Checkbox
              checked={dontShowAlertAnymore}
              onChange={(e) => setDontShowAlertAnymore(e.currentTarget.checked)}
              label="Don't show this anymore"
            />
          )}
        </Stack>
      </Alert>
    );
  }, [dontShowAlertAnymore]);
  return <>{showFullscreenAlert && fullScreenAlert}</>;
}
