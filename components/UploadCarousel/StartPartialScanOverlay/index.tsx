import React, { useContext, useMemo, useState } from "react";
import { IconDental, IconFlag, IconMoodNeutral, IconWhirl } from "@tabler/icons-react";
import { Button, Group, Stack, rem } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import ImageCardStack from "@/components/UploadCarousel/ImageCardStack";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import openErrorModal from "@/helpers/openErrorModal";
import { TypeEnum } from "@/types/global";
import classes from "./StartPartialScanOverlay.module.css";

type Props = {
  type: TypeEnum;
  userId?: string;
  distinctUploadedParts: string[];
  outerStyles?: { [key: string]: unknown };
  innerStyles?: { [key: string]: unknown };
};

const iconsMap: { [key: string]: React.ReactNode } = {
  face: <IconMoodNeutral className={classes.somethingToScanIcon} />,
  mouth: <IconDental className={classes.somethingToScanIcon} />,
  scalp: <IconWhirl className={classes.somethingToScanIcon} />,
};

export default function StartPartialScanOverlay({
  userId,
  type,
  distinctUploadedParts,
  outerStyles,
  innerStyles,
}: Props) {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const { blurType } = useContext(BlurChoicesContext);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const { toAnalyze } = userDetails || {};

  const uploadedParts = toAnalyze?.[type as TypeEnum.HEAD | TypeEnum.BODY];

  async function handleStartAnalysis() {
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
        const redirectUrl = encodeURIComponent(`/analysis?${location.search}`);
        router.push(`/wait?redirectUrl=${redirectUrl}`);
      }
    } catch (err) {
      console.log("Error in handleStartAnalysis: ", err);
      setIsButtonLoading(false);
    }
  }

  const toDisplay = useMemo(() => {
    const contentUrlTypes = uploadedParts?.flatMap((part) => part.contentUrlTypes);
    let toDisplay = contentUrlTypes?.filter((obj) => obj.name !== "original") || [];

    if (toDisplay.length === 0) {
      toDisplay = uploadedParts?.map((p) => p.mainUrl) || [];
    }
    return toDisplay;
  }, [uploadedParts?.length]);

  return (
    <Stack className={classes.container} style={outerStyles ? outerStyles : {}}>
      <Stack className={classes.wrapper} style={innerStyles ? innerStyles : {}} c="dimmed">
        {uploadedParts && uploadedParts.length > 0 && (
          <ImageCardStack images={toDisplay.map((part) => part.url || "")} />
        )}
        <Group className={classes.somethingToScanContainer}>
          Analyze the{" "}
          {distinctUploadedParts.map((partName, i) => (
            <Group className={classes.somethingToScanCell} key={partName}>
              {iconsMap[partName]}
              {upperFirst(partName)}
            </Group>
          ))}
        </Group>
        <Button
          size="md"
          className={classes.button}
          onClick={handleStartAnalysis}
          loading={isButtonLoading}
          disabled={isButtonLoading}
        >
          <IconFlag className="icon" style={{ marginRight: rem(8) }} /> Start scan
        </Button>
      </Stack>
    </Stack>
  );
}
