"use client";

import React, { useCallback, useContext, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Button, Stack, Text } from "@mantine/core";
import UploadedImagesContent from "@/components/UploadContainer/StartPartialScanOverlay/UploadedImagesContent";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import createBuyScanSession from "@/functions/createBuyScanSession";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import classes from "./GetScoresAndFeedbackCard.module.css";

type Props = {
  title: string;
};

export default function GetScoresAndFeedbackCard({ title }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [enableScanAnalysis, setEnableScanAnalysis] = useState(true);
  const [loadingButton, setLoadingButton] = useState<"analysis" | "return" | null>(null);

  const { _id: userId, scanAnalysisQuota, latestScanImages } = userDetails || {};

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?${searchParams.toString()}`;

  const handleStartAnalysis = async () => {
    try {
      if (!userId) throw new Error("Missing user id");

      setLoadingButton("analysis");

      if (scanAnalysisQuota === 0 && enableScanAnalysis) {
        setLoadingButton(null);
        createBuyScanSession({
          redirectUrl,
          setUserDetails,
          cb: () => setEnableScanAnalysis(true),
        });
        return;
      }

      const response = await callTheServer({
        endpoint: "getScoresAndFeedback",
        method: "POST",
      });

      if (response.status === 200) {
        if (response.error) {
          setLoadingButton(null);

          if (response.error === "buy scan analysis") {
            createBuyScanSession({
              redirectUrl,
              setUserDetails,
              cb: handleStartAnalysis,
            });
            return;
          }

          openErrorModal({ description: response.error });
          return;
        }
        router.push(`/wait?redirectUrl=${encodeURIComponent(redirectUrl)}`);
      }
    } catch (err) {
      setLoadingButton(null);
    }
  };

  const handleReturnToRoutines = useCallback(() => {
    setLoadingButton("return");
    router.push("/routines");
  }, []);

  return (
    <Stack className={`${classes.container} scrollbar`}>
      <Text className={classes.title} c="dimmed">
        {title}
      </Text>
      <Stack className={classes.content}>
        <UploadedImagesContent
          title="Progress scan uploaded"
          images={latestScanImages}
          enableScanAnalysis={enableScanAnalysis}
          setEnableScanAnalysis={setEnableScanAnalysis}
          buttons={
            <Stack>
              <Button
                loading={loadingButton === "analysis"}
                disabled={loadingButton !== null}
                onClick={() =>
                  createBuyScanSession({
                    redirectUrl,
                    setUserDetails,
                    cb: handleStartAnalysis,
                  })
                }
              >
                Get scores and feedback
              </Button>
              <Button
                variant="default"
                loading={loadingButton === "return"}
                disabled={loadingButton !== null}
                onClick={handleReturnToRoutines}
              >
                Return to routines
              </Button>
            </Stack>
          }
          hideCheckbox
        />
      </Stack>
    </Stack>
  );
}
