"use client";

import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { Loader, Progress, rem, Stack, Text } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import { saveToLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import { delayExecution } from "@/helpers/utils";
import { UserDataType } from "@/types/global";
import Disclaimer from "./Disclaimer";
import classes from "./WaitComponent.module.css";

type Props = {
  type: string;
  errorRedirectUrl: string;
  hideDisclaimer?: boolean;
  onComplete: (args?: any) => void;
  customContainerStyles?: { [key: string]: any };
  customWrapperStyles?: { [key: string]: any };
};

function WaitComponent({
  type,
  errorRedirectUrl,
  hideDisclaimer,
  customContainerStyles,
  customWrapperStyles,
  onComplete,
}: Props) {
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [progress, setProgress] = useState<number>();

  const { _id: userId } = userDetails || {};

  const checkAnalysisCompletion = useCallback(
    async (intervalId: NodeJS.Timeout) => {
      try {
        if (!userId) return;

        const response = await callTheServer({
          endpoint: `checkAnalysisCompletion`,
          body: { userId, type },
          method: "POST",
        });

        if (response.status === 200) {
          const { jobProgress, ...otherData } = response.message;

          if (jobProgress < 100) {
            if (intervalId) setProgress(jobProgress);
          } else if (jobProgress >= 100) {
            setProgress(100);

            saveToLocalStorage("runningAnalyses", { [type]: false }, "add");
            clearInterval(intervalId);

            await delayExecution(1000);

            setUserDetails((prev: UserDataType) => ({
              ...prev,
              ...otherData,
            }));

            if (onComplete) onComplete();
          }
        } else {
          clearInterval(intervalId);
          openErrorModal({
            title: "🚨 An error occurred",
            description: response.error,
            onClose: () => router.push(errorRedirectUrl),
          });
        }
      } catch (err) {
        console.log("Error in checkAnalysisCompletion: ", err);
        clearInterval(intervalId);
      }
    },
    [userId, type]
  );

  useEffect(() => {
    if (!userId) return;
    let intervalId: NodeJS.Timeout;
    const updateInterval = 3000;

    saveToLocalStorage("runningAnalyses", { [type]: true }, "add");

    intervalId = setInterval(() => {
      checkAnalysisCompletion(intervalId);
    }, updateInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [userId, type]);

  const description = !progress ? "Loading..." : `Analyzing your ${type}`;

  return (
    <Stack className={classes.container} style={customContainerStyles ? customContainerStyles : {}}>
      <Stack className={classes.wrapper} style={customWrapperStyles ? customWrapperStyles : {}}>
        <Loader type="bars" mb={rem(8)} />
        <Progress className={classes.progress} w="100%" value={progress || 0} animated />
        <Text c="dimmed" size="sm">
          {description} {progress && <span>({progress}%)</span>}
        </Text>
        {!hideDisclaimer && <Disclaimer />}
      </Stack>
    </Stack>
  );
}

export default memo(WaitComponent);
