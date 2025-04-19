import React, { memo, useMemo } from "react";
import { IconCalendar } from "@tabler/icons-react";
import cn from "classnames";
import { Button, Group, Skeleton, Text } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
import Indicator from "@/components/Indicator";
import { formatDate } from "@/helpers/formatDate";
import { getPartIcon } from "@/helpers/icons";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { normalizeString } from "@/helpers/utils";
import { PurchaseType } from "@/types/global";
import classes from "./PurchaseRow.module.css"; // Assume this CSS works for both variants

type CommonProps = {
  data: PurchaseType;
  onRowClick?: (userName: string) => void;
  variant: "buyer" | "seller";
};

type BuyerProps = CommonProps & {
  variant: "buyer";
  onSubscribeClick: (sellerId: string, sellerName: string, part: string, concern: string) => void;
  onUnsubscribeClick: () => void;
};

type SellerProps = CommonProps & {
  variant: "seller";
};

type Props = BuyerProps | SellerProps;

function PurchaseRow(props: Props) {
  const { data, onRowClick, variant, ...restProps } = props;

  const {
    buyerAvatar,
    sellerAvatar,
    sellerName,
    sellerId,
    buyerName,
    part,
    concern,
    subscriptionId,
    contentEndDate,
    isDeactivated,
  } = data;

  const showSkeleton = useShowSkeleton();
  const icon = getPartIcon(part, "icon");
  const status = useMemo(
    () => (isDeactivated ? "inactive" : subscriptionId ? "active" : "inactive"),
    [subscriptionId, isDeactivated]
  );

  const dateLabel = useMemo(() => {
    const dateTo = formatDate({ date: contentEndDate, hideYear: true });
    const year = new Date(contentEndDate).getFullYear();
    return `Up to ${dateTo} ${year}`;
  }, [contentEndDate]);

  const handleButtonClick = useMemo(() => {
    if (variant === "buyer") {
      const { onSubscribeClick, onUnsubscribeClick } = restProps as BuyerProps;
      return status === "active"
        ? () => onUnsubscribeClick()
        : () => onSubscribeClick(sellerId, sellerName, part, concern);
    }
    return undefined;
  }, [variant, status, sellerId, sellerName, part, concern, restProps]);

  const name = buyerName || sellerName;

  return (
    <Skeleton visible={showSkeleton}>
      <Group className={cn(classes.container, { [classes.cursorDefault]: variant === "seller" })}>
        <AvatarComponent avatar={buyerAvatar || sellerAvatar} size="sm" />
        <Text lineClamp={1} className={classes.name}>
          {name}
        </Text>
        <Group wrap="nowrap">
          <Text className={classes.name}>
            {icon}
            <Text component="span">{normalizeString(concern)}</Text>
          </Text>
          <Text component="span" className={classes.name}>
            <IconCalendar className="icon icon__small" />
            <Text component="span">{dateLabel}</Text>
          </Text>
        </Group>

        <Button
          variant="default"
          ml="auto"
          component="div"
          className={classes.button}
          disabled={variant === "seller"}
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick?.();
          }}
        >
          <Indicator status={status} shape="round" isStatic />{" "}
          <span className={classes.subscribe}>
            {status === "active" ? "Subscribed" : "Not subscribed"}
          </span>
        </Button>
      </Group>
    </Skeleton>
  );
}

export default memo(PurchaseRow);
