import React, { useMemo, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { SegmentedControl, Stack, Text } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import { segments } from "../segments";
import classes from "./DisplayClubAbout.module.css";

type BioDataType = {
  philosophy: string;
  style: string;
  tips: string;
};

type Props = {
  bioData: BioDataType;
};

export default function DisplayClubAbout({ bioData }: Props) {
  const [showSegment, setShowSegment] = useState("philosophy");

  const currentSegment = useMemo(
    () => segments.find((segment) => segment.value === showSegment) || segments[0],
    [showSegment]
  );

  const value = bioData[currentSegment.value as keyof BioDataType];
  const placeholder = `No ${currentSegment.value}`;

  return (
    <Stack className={classes.container}>
      <SegmentedControl data={segments} value={showSegment} onChange={setShowSegment} />
      <Stack className={classes.wrapper}>
        {value ? (
          <Text className={classes.text}>{value}</Text>
        ) : (
          <OverlayWithText text={placeholder} icon={<IconCircleOff className="icon" />} />
        )}
      </Stack>
    </Stack>
  );
}
