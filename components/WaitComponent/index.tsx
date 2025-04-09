"use client";

import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { Loader, Progress, rem, Stack, Text } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import openErrorModal from "@/helpers/openErrorModal";
import Disclaimer from "./Disclaimer";
import classes from "./WaitComponent.module.css";

type Props = {
  operationKey: string;
  errorRedirectUrl?: string;
  hideDisclaimer?: boolean;
  description: string;
  onComplete: (args?: any) => void;
  onError?: (args?: any) => void;
  customContainerStyles?: { [key: string]: any };
  customWrapperStyles?: { [key: string]: any };
};

function WaitComponent({
  description,
  operationKey,
  errorRedirectUrl,
  hideDisclaimer,
  customContainerStyles,
  customWrapperStyles,
  onComplete,
  onError,
}: Props) {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const [progress, setProgress] = useState<number>();

  const { _id: userId } = userDetails || {};

  const checkAnalysisCompletion = useCallback(
    async (intervalId: NodeJS.Timeout) => {
      try {
        if (!userId) return;

        console.log("userId, operationKey", userId, operationKey);

        const response = await callTheServer({
          endpoint: `checkAnalysisCompletion`,
          body: { userId, operationKey },
          method: "POST",
        });

        console.log("response", response);

        if (response.status === 200) {
          if (response.error) {
            console.log("line 56", response.error);
            clearInterval(intervalId);
            if (onError) onError();
            openErrorModal({
              description: response.error,
              onClose: () => {
                if (errorRedirectUrl) router.push(errorRedirectUrl);
              },
            });
            return;
          }

          const { jobProgress, ...otherData } = response.message;

          console.log("response.message", response.message);

          if (jobProgress < 100) {
            setProgress(jobProgress);
          } else if (jobProgress >= 100) {
            setProgress(100);

            console.log("line 77", response.error);
            clearInterval(intervalId);

            onComplete(otherData);
          }
        }
      } catch (err) {
        console.log("line 84", err);

        clearInterval(intervalId);
        if (onError) onError();
      }
    },
    [userId, operationKey]
  );

  useEffect(() => {
    if (!userId) return;
    const updateInterval = 6000;

    const intervalId = setInterval(() => {
      console.log("checked");
      checkAnalysisCompletion(intervalId);
    }, updateInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [userId, operationKey]);

  const finalDescription = !progress ? "Loading..." : description;

  return (
    <Stack className={classes.container} style={customContainerStyles ? customContainerStyles : {}}>
      <Stack className={classes.wrapper} style={customWrapperStyles ? customWrapperStyles : {}}>
        <Loader type="bars" mb={rem(8)} />
        <Progress className={classes.progress} size={12} w="100%" value={progress || 0} animated />
        <Text c="dimmed" size="sm">
          {finalDescription} {progress && <span>({progress}%)</span>}
        </Text>
        {!hideDisclaimer && <Disclaimer />}
      </Stack>
    </Stack>
  );
}

export default memo(WaitComponent);
