import React, { memo, useMemo } from "react";
import { Group, Highlight, Stack } from "@mantine/core";
import AreaChart from "@/components/AreaChart";
import RingComponent from "@/components/RingComponent";
import classes from "./ComparisonStack.module.css";

type Props = {
  ringData: { value: number; label: string; color: string }[];
  ringSize: number;
  highlight: string;
  isPotential: boolean;
  highlightText: string;
  higherThanNumber: number;
};

function ComparisonStack({
  ringData,
  isPotential,
  ringSize,
  highlight,
  highlightText,
  higherThanNumber,
}: Props) {
  const fontSize = useMemo(() => Math.max(ringSize * 0.15, 12), []);
  return (
    <Stack className={classes.container}>
      <Group className={classes.row}>
        <RingComponent data={ringData} ringSize={ringSize} fontSize={fontSize} />
        <Highlight highlight={highlight} ta="center" size="md" mb={ringSize > 100 ? 16 : 0}>
          {highlightText}
        </Highlight>
      </Group>
      <AreaChart referenceLineValue={higherThanNumber || 0} isCurrent={!isPotential} />
    </Stack>
  );
}

export default memo(ComparisonStack);
