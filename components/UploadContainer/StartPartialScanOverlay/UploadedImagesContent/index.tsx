import React, { useContext } from "react";
import { usePathname } from "next/navigation";
import { Checkbox, Stack, Title } from "@mantine/core";
import ImageCardStack from "@/components/UploadContainer/ImageCardStack";
import { UserContext } from "@/context/UserContext";
import createBuyScanSession from "@/functions/createBuyScanSession";
import classes from "./UploadedImagesContent.module.css";

type Props = {
  title: string;
  buttons: React.ReactNode;
  enableScanAnalysis: boolean;
  hideCheckbox?: boolean;
  isFirstAnalysis?: boolean;
  images?: string[];
  setEnableScanAnalysis: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UploadedImagesContent({
  title,
  images,
  buttons,
  isFirstAnalysis,
  hideCheckbox,
  enableScanAnalysis,
  setEnableScanAnalysis,
}: Props) {
  const pathname = usePathname();
  const { userDetails, setUserDetails } = useContext(UserContext);

  const { scanAnalysisQuota } = userDetails || {};

  const handleEnableAnalysis = (enable: boolean) => {
    if (typeof scanAnalysisQuota !== "number") return;
    if (!isFirstAnalysis && scanAnalysisQuota === 0 && enable) {
      const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}`;
      createBuyScanSession({ redirectUrl, setUserDetails });
      return;
    }
    setEnableScanAnalysis(enable);
  };

  return (
    <Stack className={classes.container} c="dimmed">
      {images && images.length > 0 && <ImageCardStack images={images} />}
      <Title order={4} className={classes.title}>
        {title}
      </Title>
      {!hideCheckbox && (
        <Checkbox
          checked={isFirstAnalysis || enableScanAnalysis}
          label="Get scores and feedback"
          onChange={(e) => handleEnableAnalysis(e.currentTarget.checked)}
          className={classes.checkbox}
        />
      )}
      {buttons}
    </Stack>
  );
}
