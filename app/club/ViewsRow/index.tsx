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
    amount: number;
  };
};

function ViewRow({ data }: Props) {
  const { part, concern, views, amount } = data;

  const showSkeleton = useShowSkeleton();
  const partIcon = getPartIcon(part, 18);

  return (
    <Skeleton visible={showSkeleton}>
      <Group className={classes.container}>
        <Text className={classes.cell}>
          {partIcon}
          <Text component="span">{normalizeString(concern)}</Text>
        </Text>
        <Text className={classes.cell}>
          <IconEye size={18} />
          <Text component="span">{views}</Text>
        </Text>
        <Text className={classes.cell}>
          <IconCashBanknote size={18} />
          <Text component="span">${amount.toFixed(3)}</Text>
        </Text>
      </Group>
    </Skeleton>
  );
}

export default memo(ViewRow);
