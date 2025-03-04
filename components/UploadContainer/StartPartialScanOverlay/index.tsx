import React, { useCallback, useContext, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Button, Checkbox, rem, Stack, Text } from "@mantine/core";
import ImageCardStack from "@/components/UploadContainer/ImageCardStack";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import getPartialScanUploadText from "@/helpers/getPartialScanUploadText";
import openErrorModal from "@/helpers/openErrorModal";
import openPaymentModal from "@/helpers/openPaymentModal";
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
  innerStyles,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { blurType } = useContext(BlurChoicesContext);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [enableAnalysis, setEnableAnalysis] = useState(true);

  const { toAnalyze, latestProgress, scanAnalysisQuota } = userDetails || {};

  const handleEnableAnalysis = useCallback(() => {
    if (scanAnalysisQuota === 0) {
      const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?${searchParams.toString()}`;

      openPaymentModal({
        title: "Add scan analysis",
        price: "1",
        isCentered: true,
        modalType: "scan",
        onClick: () =>
          createCheckoutSession({
            priceId: process.env.NEXT_PUBLIC_IMPROVEMENT_PRICE_ID!,
            redirectUrl,
            cancelUrl: redirectUrl,
            mode: "payment",
            setUserDetails,
          }),
        buttonText: "Buy scan analysis",
        onClose: () => {
          fetchUserData({ setUserDetails });
          setEnableAnalysis(true);
        },
      });

      return;
    }
    setEnableAnalysis(true);
  }, [scanAnalysisQuota, userDetails]);

  const handleStartAnalysis = useCallback(async () => {
    try {
      if (!userId) throw new Error("Missing user id");
      setIsButtonLoading(true);

      const response = await callTheServer({
        endpoint: "startProgressAnalysis",
        method: "POST",
        body: { userId, blurType },
      });

      if (response.status === 200) {
        if (response.error) {
          openErrorModal({ description: response.error });
          setIsButtonLoading(false);
          return;
        }
        const redirectUrl = encodeURIComponent(`/analysis?${searchParams.toString()}`);
        router.push(`/wait?redirectUrl=${redirectUrl}`);
      }
    } catch (err) {
      setIsButtonLoading(false);
    }
  }, [userId, blurType]);

  const isFirstAnalysis = useMemo(() => {
    if (!latestProgress) return;
    const values = Object.values(latestProgress).filter((v) => typeof v !== "number");
    const isNew = values.every((v) => !Boolean(v));
    return isNew;
  }, [latestProgress]);

  const toDisplay = useMemo(() => {
    const contentUrlTypes = toAnalyze?.flatMap((part) => part.contentUrlTypes);
    let toDisplay = contentUrlTypes?.filter((obj) => obj.name !== "original") || [];

    if (toDisplay.length === 0) {
      toDisplay = toAnalyze?.map((p) => p.mainUrl) || [];
    }
    return toDisplay;
  }, [toAnalyze?.length]);

  const analysisString = getPartialScanUploadText(distinctUploadedParts);

  return (
    <Stack className={classes.container} style={outerStyles ? outerStyles : {}}>
      <Stack className={classes.wrapper} style={innerStyles ? innerStyles : {}} c="dimmed">
        {toAnalyze && toAnalyze.length > 0 && (
          <ImageCardStack images={toDisplay.map((part) => part.url || "")} />
        )}
        <Text mb={rem(12)}>{analysisString}</Text>
        <Checkbox
          disabled={!isFirstAnalysis}
          checked={isFirstAnalysis || enableAnalysis}
          label="Analyze appearance and give feedback"
          onChange={handleEnableAnalysis}
        />
        <Button onClick={handleStartAnalysis} loading={isButtonLoading} disabled={isButtonLoading}>
          Start analysis
        </Button>
      </Stack>
    </Stack>
  );
}
