import React, { useCallback, useContext, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import createBuyScanSession from "@/functions/createBuyScanSession";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import getPartialScanUploadText from "@/helpers/getPartialScanUploadText";
import openErrorModal from "@/helpers/openErrorModal";
import UploadedImagesContent from "./UploadedImagesContent";
import classes from "./StartPartialScanOverlay.module.css";

type Props = {
  userId: string | null;
  distinctUploadedParts: string[];
  outerStyles?: { [key: string]: unknown };
  innerStyles?: { [key: string]: unknown };
};

export default function StartPartialScanOverlay({
  userId,
  distinctUploadedParts,
  outerStyles,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { blurType } = useContext(BlurChoicesContext);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [enableScanAnalysis, setEnableScanAnalysis] = useState(false);

  const { scanAnalysisQuota, toAnalyze } = userDetails || {};

  const handleStartAnalysis = useCallback(async () => {
    try {
      if (!userId) throw new Error("Missing user id");

      setIsButtonLoading(true);

      const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?${searchParams.toString()}`;

      if (scanAnalysisQuota === 0 && enableScanAnalysis) {
        setIsButtonLoading(false);
        createBuyScanSession({
          redirectUrl,
          setUserDetails,
        });
        return;
      }

      const response = await callTheServer({
        endpoint: "startProgressAnalysis",
        method: "POST",
        body: { userId, blurType, enableScanAnalysis },
      });

      if (response.status === 200) {
        if (response.error) {
          setIsButtonLoading(false);

          if (response.error === "buy scan analysis") {
            createBuyScanSession({
              redirectUrl,
              setUserDetails,
            });
            return;
          }

          openErrorModal({ description: response.error });
          return;
        }

        const analysisRedirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/analysis?${searchParams.toString()}`;
        router.push(`/wait?redirectUrl=${encodeURIComponent(analysisRedirectUrl)}`);
      }
    } catch (err) {
      setIsButtonLoading(false);
    }
  }, [userId, blurType, pathname, scanAnalysisQuota, enableScanAnalysis]);

  const analysisString = getPartialScanUploadText(distinctUploadedParts);

  const images = useMemo((): string[] => {
    const contentUrlTypes = toAnalyze?.flatMap((part) => part.contentUrlTypes);
    let toDisplay = contentUrlTypes?.filter((obj) => obj.name !== "original") || [];
    if (toDisplay.length === 0) {
      toDisplay = toAnalyze?.map((p) => p.mainUrl) || [];
    }
    const imgs = toDisplay.map((obj) => obj.url).filter((url): url is string => !!url);
    return imgs;
  }, [toAnalyze?.length]);

  return (
    <Stack className={classes.container} style={outerStyles ? outerStyles : {}}>
      <UploadedImagesContent
        title={analysisString}
        images={images}
        enableScanAnalysis={enableScanAnalysis}
        setEnableScanAnalysis={setEnableScanAnalysis}
        buttons={
          <Button
            onClick={handleStartAnalysis}
            loading={isButtonLoading}
            disabled={isButtonLoading}
          >
            Start analysis
          </Button>
        }
      />
    </Stack>
  );
}
