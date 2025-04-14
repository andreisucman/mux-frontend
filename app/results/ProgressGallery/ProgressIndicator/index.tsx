import React, { memo, useMemo } from "react";
import { Group } from "@mantine/core";
import RingComponent from "@/components/RingComponent";
import { getRingColor } from "@/helpers/utils";
import classes from "./ProgressIndicator.module.css";

type Props = {
  customStyles?: { [key: string]: any };
  showTitle?: boolean;
  ringSize: number;
  record: any;
};

function ProgressIndicator({ customStyles, showTitle = false, ringSize, record }: Props) {
  const { concernScoreDifference } = record || {};
  const { explanations, ...rest } = concernScoreDifference || {};

  const ringColor = useMemo(
    () => getRingColor(concernScoreDifference.value),
    [concernScoreDifference]
  );

  return (
    <Group className={classes.container} style={customStyles ? customStyles : {}} gap={0}>
      <RingComponent
        ringSize={ringSize}
        data={[
          {
            value: concernScoreDifference.value as number,
            label: "Overall",
            color: ringColor,
          },
          {
            value: 100 - (concernScoreDifference.value as number),
            label: "Overall",
            color: "gray.4",
          },
        ]}
        showTitle={showTitle}
      />
    </Group>
  );
}

export default memo(ProgressIndicator);
