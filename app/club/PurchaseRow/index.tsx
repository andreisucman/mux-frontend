import React, { memo, useMemo } from "react";
import { Button, Skeleton, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import AvatarComponent from "@/components/AvatarComponent";
import Indicator from "@/components/Indicator";
import { formatDate } from "@/helpers/formatDate";
import { getPartIcon } from "@/helpers/icons";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { PurchaseType } from "@/types/global";
import classes from "./PurchaseRow.module.css";

type Props = {
  pageType: "buyer" | "seller";
  data: PurchaseType;
  onRowClick?: (userName?: string) => void;
  onSubscribeClick?: (sellerId: string, part: string) => void;
};

function PurchaseRow({ pageType, data, onRowClick, onSubscribeClick }: Props) {
  const {
    buyerAvatar,
    sellerAvatar,
    sellerName,
    sellerId,
    buyerName,
    part,
    subscribedUntil,
    contentStartDate,
    contentEndDate,
  } = data;

  const dateLabel = useMemo(() => {
    const sameMonth = new Date(contentStartDate).getMonth() === new Date(contentEndDate).getMonth();

    const dateFrom = formatDate({ date: contentStartDate, hideYear: true, hideMonth: sameMonth });
    const dateTo = formatDate({ date: contentEndDate, hideYear: true });
    const year = new Date(contentEndDate).getFullYear();

    let label = ``;

    if (dateFrom) {
      const areSame = dateTo.slice(0, 2) === dateFrom.slice(0, 2);
      const parts = [` - ${dateTo} ${year}`];

      if (!areSame) {
        parts.unshift(dateFrom);
      }

      label += parts.join("");
    }

    return label;
  }, [contentStartDate, contentEndDate]);

  const showSkeleton = useShowSkeleton();

  const icon = getPartIcon(part, "icon");
  const status = useMemo(
    () => (subscribedUntil && new Date(subscribedUntil) > new Date() ? "active" : "inactive"),
    [subscribedUntil]
  );
  const disableButton = useMemo(
    () => status === "active" || pageType === "seller",
    [status, pageType]
  );

  return (
    <Stack
      className={classes.wrapper}
      onClick={onRowClick ? () => onRowClick(buyerName || sellerName) : undefined}
    >
      <Skeleton
        className={classes.container}
        style={onRowClick ? { cursor: "pointer" } : {}}
        visible={showSkeleton}
      >
        <AvatarComponent avatar={buyerAvatar || sellerAvatar} size="sm" />
        <Text lineClamp={1} className={classes.name}>
          {buyerName || sellerName}
        </Text>
        <Text className={classes.name}>
          {icon}
          <Text component="span">{upperFirst(part)}</Text>
          <Text component="span">{dateLabel}</Text>
        </Text>
        <Button
          disabled={disableButton}
          variant="default"
          ml="auto"
          component="div"
          onClick={(e) => {
            e.stopPropagation();
            if (onSubscribeClick) onSubscribeClick(sellerId, part);
          }}
        >
          <Indicator status={status} shape="round" isStatic />{" "}
          <span className={classes.subscribe}>
            {status === "active" ? "Subscribed" : "Subscribe"}
          </span>
        </Button>
      </Skeleton>
    </Stack>
  );
}

export default memo(PurchaseRow);
