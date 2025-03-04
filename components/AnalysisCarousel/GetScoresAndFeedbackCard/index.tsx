"use client";

import React, { useCallback, useContext, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Button, Skeleton, Stack, Text } from "@mantine/core";
import UploadedImagesContent from "@/components/UploadContainer/StartPartialScanOverlay/UploadedImagesContent";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import createBuyScanSession from "@/functions/createBuyScanSession";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import { FormattedRatingType, ProgressType } from "@/types/global";
import classes from "./GetScoresAndFeedbackCard.module.css";

type Props = {
  title: string;
  currentRecord: { [key: string]: ProgressType | null | number };
  latestScores: { [key: string]: FormattedRatingType | null | number };
};

export default function GetScoresAndFeedbackCard({ title }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [enableScanAnalysis, setEnableScanAnalysis] = useState(true);
  const [loadingButton, setLoadingButton] = useState<"analysis" | "return" | null>(null);

  const { _id: userId, scanAnalysisQuota } = userDetails || {};

  const sessionRedirect = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?${searchParams.toString()}`;

  const handleStartAnalysis = async () => {
    try {
      if (!userId) throw new Error("Missing user id");
      const sessionRedirect = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?${searchParams.toString()}`;

      setLoadingButton("analysis");

      if (scanAnalysisQuota === 0 && enableScanAnalysis) {
        setLoadingButton(null);
        createBuyScanSession({
          redirectUrl: sessionRedirect,
          setUserDetails,
          cb: () => setEnableScanAnalysis(true),
        });
        return;
      }

      const response = await callTheServer({
        endpoint: "startProgressAnalysis",
        method: "POST",
        // body: { userId, blurType, enableScanAnalysis },
      });

      if (response.status === 200) {
        if (response.error) {
          setLoadingButton(null);

          if (response.error === "buy scan analysis") {
            createBuyScanSession({
              redirectUrl: sessionRedirect,
              setUserDetails,
              cb: handleStartAnalysis,
            });
            return;
          }

          openErrorModal({ description: response.error });
          return;
        }
        const redirectUrl = encodeURIComponent(`/${pathname}?${searchParams.toString()}`);
        router.push(`/wait?redirectUrl=${redirectUrl}`);
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
    <Skeleton className="skeleton">
      <Stack className={`${classes.container} scrollbar`}>
        <Text className={classes.title} c="dimmed">
          {title}
        </Text>
        <UploadedImagesContent
          title="Progress scan uploaded"
          enableScanAnalysis={enableScanAnalysis}
          setEnableScanAnalysis={setEnableScanAnalysis}
          buttons={
            <Stack>
              <Button
                loading={loadingButton === "analysis"}
                disabled={loadingButton !== null}
                onClick={() =>
                  createBuyScanSession({
                    redirectUrl: sessionRedirect,
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
        />
      </Stack>
    </Skeleton>
  );
}
