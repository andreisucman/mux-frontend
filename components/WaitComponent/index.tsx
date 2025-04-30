"use client";

import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader, Progress, rem, Stack, Text } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
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

        const response = await callTheServer({
          endpoint: `checkAnalysisCompletion`,
          body: { userId, operationKey },
          method: "POST",
        });

        if (response.status === 200) {
          if (response.error) {
            clearInterval(intervalId);
            if (onError) onError();
            openErrorModal({
              description: response.error,
              onClose: () => {
                if (errorRedirectUrl) router.replace(errorRedirectUrl);
              },
            });
            return;
          }

          const { jobProgress, ...otherData } = response.message;

          if (jobProgress < 100) {
            setProgress(jobProgress);
          } else if (jobProgress >= 100) {
            setProgress(100);

            clearInterval(intervalId);

            onComplete(otherData);
          }
        }
      } catch (err) {
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
      checkAnalysisCompletion(intervalId);
    }, updateInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [userId, operationKey]);

  const finalDescription = progress ? description : "Loading...";

  return (
    <Stack className={classes.container} style={customContainerStyles ? customContainerStyles : {}}>
      <Stack className={classes.wrapper} style={customWrapperStyles ? customWrapperStyles : {}}>
        <Loader type="bars" mb={rem(8)} />
        <Progress className={classes.progress} size={12} w="100%" value={progress || 0} animated />
        <Text c="dimmed" size="sm">
          {finalDescription} {progress ?<span>({progress}%)</span> : ""}
        </Text>
        {!hideDisclaimer && (
          <Disclaimer
            title="Disclaimer"
            body="The content of this website is for informational purposes only and is not intended as
        professional medical advice. It should not be used for diagnosing or treating any medical
        condition. Always seek the guidance of a qualified healthcare provider with any questions or
        concerns you may have regarding your health or medical care. Never disregard professional
        advice or delay seeking it because of something you see on this site."
          />
        )}
      </Stack>
    </Stack>
  );
}

export default memo(WaitComponent);
