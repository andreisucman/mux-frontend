import React, { useContext, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Checkbox, rem, Stack, Title } from "@mantine/core";
import ImageCardStack from "@/components/UploadContainer/ImageCardStack";
import { UserContext } from "@/context/UserContext";
import createBuyScanSession from "@/functions/createBuyScanSession";
import classes from "./UploadedImagesContent.module.css";

type Props = {
  title: string;
  buttons: React.ReactNode;
  enableScanAnalysis: boolean;
  setEnableScanAnalysis: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UploadedImagesContent({
  title,
  buttons,
  enableScanAnalysis,
  setEnableScanAnalysis,
}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);

  const { scanAnalysisQuota, toAnalyze, latestProgress } = userDetails || {};

  const isFirstAnalysis = useMemo(() => {
    if (!latestProgress) return;
    const values = Object.values(latestProgress).filter((v) => typeof v !== "number");
    const isNew = values.every((v) => !Boolean(v));
    return isNew;
  }, [latestProgress]);

  const handleEnableAnalysis = (enable: boolean) => {
    if (typeof scanAnalysisQuota !== "number") return;
    if (!isFirstAnalysis && scanAnalysisQuota === 0 && enable) {
      const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?${searchParams.toString()}`;
      createBuyScanSession({ redirectUrl, setUserDetails, cb: () => setEnableScanAnalysis(true) });
      return;
    }
    setEnableScanAnalysis(enable);
  };

  const toDisplay = useMemo(() => {
    const contentUrlTypes = toAnalyze?.flatMap((part) => part.contentUrlTypes);
    let toDisplay = contentUrlTypes?.filter((obj) => obj.name !== "original") || [];

    if (toDisplay.length === 0) {
      toDisplay = toAnalyze?.map((p) => p.mainUrl) || [];
    }
    return toDisplay;
  }, [toAnalyze?.length]);

  return (
    <Stack className={classes.container} c="dimmed">
      {toAnalyze && toAnalyze.length > 0 && (
        <ImageCardStack images={toDisplay.map((part) => part.url || "")} />
      )}
      <Title order={5} mb={rem(12)}>
        {title}
      </Title>
      <Checkbox
        disabled={!isFirstAnalysis}
        checked={isFirstAnalysis || enableScanAnalysis}
        label="Get scores and feedback"
        onChange={(e) => handleEnableAnalysis(e.currentTarget.checked)}
        mb={20}
      />
      {buttons}
    </Stack>
  );
}
