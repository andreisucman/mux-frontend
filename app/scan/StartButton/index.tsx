import React, { useMemo } from "react";
import Image from "next/image";
import { IconBodyScan, IconUserScan } from "@tabler/icons-react";
import cn from "classnames";
import { Overlay, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconScanFood, IconScanStyle } from "@/components/customIcons";
import Timer from "@/components/Timer";
import { formatDate } from "@/helpers/formatDate";
import { daysFrom } from "@/helpers/utils";
import classes from "./StartButton.module.css";

type Props = {
  type: "head" | "body" | "style" | "food";
  needsScan: boolean;
  nextScanDate?: Date | null;
  onClick: () => void;
};

const icons = {
  head: <IconUserScan className="icon icon__large" />,
  body: <IconBodyScan className="icon icon__large" />,
  style: <IconScanStyle className={`icon ${classes.icon}`} />,
  food: <IconScanFood className={`icon ${classes.icon}`} />,
};

export default function StartButton({ onClick, type, needsScan, nextScanDate }: Props) {
  const overlayProps = useMemo(() => {
    const afterOneDay = daysFrom({ days: 1 });
    const payload: {
      blur?: number;
      children?: React.ReactNode;
    } = {};

    if (needsScan && nextScanDate && nextScanDate > new Date()) {
      payload.blur = 5;

      if (nextScanDate > afterOneDay) {
        const formattedDate = formatDate({ date: nextScanDate, hideYear: true });
        payload.children = (
          <Stack className={classes.stack}>
            <Text size="sm">Next {type} scan after:</Text>
            <Text fw={600}>{formattedDate}</Text>
          </Stack>
        );
      } else {
        payload.children = (
          <Stack className={classes.stack}>
            <Text size="sm">Next {type} scan after:</Text>
            <Timer date={nextScanDate} />
          </Stack>
        );
      }
    }
    return payload;
  }, [needsScan, nextScanDate, type]);

  return (
    <UnstyledButton
      className={cn(classes.container, { [classes.disabled]: !needsScan })}
      onClick={onClick}
    >
      <div className={classes.imageWrapper}>
        <Image
          src="https://placehold.co/160x213"
          className={classes.image}
          alt=""
          width={180}
          height={240}
        />
        <Overlay
          {...overlayProps}
          className={cn(classes.overlay, { [classes.disabledOverlay]: !needsScan })}
        />
      </div>
      <Text className={classes.label}>
        {icons[type]}Scan {type}
      </Text>
    </UnstyledButton>
  );
}
