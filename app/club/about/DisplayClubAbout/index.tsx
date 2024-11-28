import React, { useMemo, useState } from "react";
import { SegmentedControl, Stack, Text } from "@mantine/core";
import { segments } from "../segments";
import classes from "./DisplayClubAbout.module.css";

type BioDataType = {
  philosophy: string;
  style: string;
  tips: string;
  about: string;
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

  return (
    <Stack className={classes.container}>
      <SegmentedControl data={segments} value={showSegment} onChange={setShowSegment} />
      <Stack className={classes.wrapper}>
        <Text className={classes.text}>{bioData[currentSegment.value as keyof BioDataType]}</Text>
      </Stack>
    </Stack>
  );
}
