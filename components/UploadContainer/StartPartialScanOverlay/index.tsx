import React, { useCallback, useContext, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, rem, Stack, Text } from "@mantine/core";
import ImageCardStack from "@/components/UploadContainer/ImageCardStack";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import getPartialScanUploadText from "@/helpers/getPartialScanUploadText";
import openErrorModal from "@/helpers/openErrorModal";
import { TypeEnum } from "@/types/global";
import classes from "./StartPartialScanOverlay.module.css";

type Props = {
  type: TypeEnum;
  userId: string | null;
  distinctUploadedParts: string[];
  outerStyles?: { [key: string]: unknown };
  innerStyles?: { [key: string]: unknown };
};

export default function StartPartialScanOverlay({
  userId,
  type,
  distinctUploadedParts,
  outerStyles,
  innerStyles,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const { blurType } = useContext(BlurChoicesContext);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const { toAnalyze } = userDetails || {};

  const uploadedParts = toAnalyze?.[type as TypeEnum.HEAD | TypeEnum.BODY];

  const handleStartAnalysis = useCallback(async () => {
    try {
      if (!userId) throw new Error("Missing user id");
      setIsButtonLoading(true);

      const response = await callTheServer({
        endpoint: "startProgressAnalysis",
        method: "POST",
        body: { userId, type, blurType },
      });

      if (response.status === 200) {
        if (response.error) {
          openErrorModal({ description: response.error });
          setIsButtonLoading(false);
          return;
        }
        const redirectUrl = encodeURIComponent(`/analysis?${searchParams.toString()}`);
        router.push(`/wait?operationKey=${`type-${type}`}&redirectUrl=${redirectUrl}`);
      }
    } catch (err) {
      setIsButtonLoading(false);
    }
  }, [userId, type, blurType]);

  const toDisplay = useMemo(() => {
    const contentUrlTypes = uploadedParts?.flatMap((part) => part.contentUrlTypes);
    let toDisplay = contentUrlTypes?.filter((obj) => obj.name !== "original") || [];

    if (toDisplay.length === 0) {
      toDisplay = uploadedParts?.map((p) => p.mainUrl) || [];
    }
    return toDisplay;
  }, [uploadedParts?.length]);

  const analysisString = getPartialScanUploadText(distinctUploadedParts);

  return (
    <Stack className={classes.container} style={outerStyles ? outerStyles : {}}>
      <Stack className={classes.wrapper} style={innerStyles ? innerStyles : {}} c="dimmed">
        {uploadedParts && uploadedParts.length > 0 && (
          <ImageCardStack images={toDisplay.map((part) => part.url || "")} />
        )}
        <Text mb={rem(12)}>{analysisString}</Text>
        <Button onClick={handleStartAnalysis} loading={isButtonLoading} disabled={isButtonLoading}>
          Start analysis
        </Button>
      </Stack>
    </Stack>
  );
}
