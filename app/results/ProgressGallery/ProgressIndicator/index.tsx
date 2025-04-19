import React, { memo, useMemo } from "react";
import { Group } from "@mantine/core";
import RingComponent from "@/components/RingComponent";
import { normalizeString } from "@/helpers/utils";
import { SimpleProgressType } from "../../types";
import classes from "./ProgressIndicator.module.css";

type Props = {
  customStyles?: { [key: string]: any };
  showTitle?: boolean;
  ringSize: number;
  record: SimpleProgressType;
};

function ProgressIndicator({ customStyles, showTitle = false, ringSize, record }: Props) {
  const { concernScoreDifference } = record || {};

  const data = useMemo(() => {
    if (!concernScoreDifference)
      return { value: 0, name: "", color: "var(--mantine-color-gray-7)" };

    const color =
      concernScoreDifference && concernScoreDifference.value > 0
        ? "var(--mantine-color-red-7)"
        : "var(--mantine-color-green-7)";

    const name = normalizeString(concernScoreDifference.name);

    return { color, name, value: concernScoreDifference.value };
  }, [concernScoreDifference]);

  return (
    <Group className={classes.container} style={customStyles ? customStyles : {}} gap={0}>
      <RingComponent
        ringSize={ringSize}
        data={[
          {
            value: data.value as number,
            label: data.name,
            color: data.color,
          },
        ]}
        showTitle={showTitle}
      />
    </Group>
  );
}

export default memo(ProgressIndicator);
