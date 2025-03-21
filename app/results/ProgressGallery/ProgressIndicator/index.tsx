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
  const { scoresDifference } = record || {};
  const { overall = 0, explanations, ...rest } = scoresDifference || {};
  let restFeatures = Object.entries(rest);

  if (restFeatures.length > 1) restFeatures.unshift(["Overall", overall]);

  const ringColor = useMemo(() => getRingColor(overall), [overall]);

  return (
    <Group className={classes.container} style={customStyles ? customStyles : {}} gap={0}>
      <RingComponent
        ringSize={ringSize}
        data={[
          {
            value: overall as number,
            label: "Overall",
            color: ringColor,
          },
          {
            value: 100 - (overall as number),
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
