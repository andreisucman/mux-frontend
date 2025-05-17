import React, { memo } from "react";
import { IconCashBanknote, IconEye } from "@tabler/icons-react";
import { Group, Skeleton, Text } from "@mantine/core";
import { getPartIcon } from "@/helpers/icons";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { normalizeString } from "@/helpers/utils";
import { PartEnum } from "@/types/global";
import classes from "./ViewsRow.module.css";

type Props = {
  data: {
    part: PartEnum;
    concern: string;
    views: number;
    earned: number;
  };
  onClick: (part: string, concern: string) => void;
};

function ViewRow({ data, onClick }: Props) {
  const { part, concern, views, earned } = data;

  const showSkeleton = useShowSkeleton();
  const partName = normalizeString(part);
  const partIcon = getPartIcon(part, 18);

  return (
    <Skeleton visible={showSkeleton}>
      <Group className={classes.container} onClick={(e) => onClick(part, concern)}>
        <Text className={classes.cell}>
          {partIcon}
          {partName}
          <Text component="span">-</Text>
          <Text component="span">{normalizeString(concern).toLowerCase()}</Text>
        </Text>
        <Group className={classes.box}>
          <Text className={classes.cell}>
            <IconEye size={18} />
            <Text component="span">{views}</Text>
          </Text>
          {earned && (
            <Text className={classes.cell}>
              <IconCashBanknote size={18} />
              <Text component="span">${earned.toFixed(2)}</Text>
            </Text>
          )}
        </Group>
      </Group>
    </Skeleton>
  );
}

export default memo(ViewRow);
