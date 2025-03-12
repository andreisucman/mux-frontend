import React, { memo } from "react";
import { Skeleton, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import AvatarComponent from "@/components/AvatarComponent";
import Indicator from "@/components/Indicator";
import { getPartIcon } from "@/helpers/icons";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { PurchaseType } from "@/types/global";
import classes from "./PurchaseRow.module.css";

type Props = {
  data: PurchaseType;
  onRowClick?: (userName?: string) => void;
};

function PurchaseRow({ data, onRowClick }: Props) {
  const { name, buyerAvatar, sellerAvatar, sellerName, buyerName, part, isSubscribed } = data;

  const showSkeleton = useShowSkeleton();

  const icon = getPartIcon(part, "icon");
  const status = isSubscribed ? "active" : "inactive";

  return (
    <Stack className={classes.wrapper} onClick={onRowClick ? () => onRowClick(buyerName || sellerName) : undefined}>
      <Skeleton
        className={classes.container}
        style={onRowClick ? { cursor: "pointer" } : {}}
        visible={showSkeleton}
      >
        <AvatarComponent avatar={buyerAvatar || sellerAvatar} size="sm" />
        <Text lineClamp={1} className={classes.name}>
          {buyerName || sellerName}
        </Text>
        {icon}
        {upperFirst(part)}
        <Indicator status={status} shape="round" isStatic />
      </Skeleton>
    </Stack>
  );
}

export default memo(PurchaseRow);
