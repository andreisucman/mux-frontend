import React, { useContext, useMemo } from "react";
import Image from "next/image";
import { IconBodyScan } from "@tabler/icons-react";
import { Text, UnstyledButton } from "@mantine/core";
import { IconScanFood, IconScanStyle } from "@/components/customIcons";
import { UserContext } from "@/context/UserContext";
import { placeholders } from "@/data/placeholders";
import { ScanTypeEnum } from "@/types/global";
import classes from "./StartButton.module.css";

type Props = {
  scanType: ScanTypeEnum;
  type: "head" | "body" | "food";
  onClick: () => void;
};

const icons: { [key: string]: React.ReactNode } = {
  progress: <IconBodyScan className="icon icon__large" />,
  style: <IconScanStyle className={`icon ${classes.icon}`} />,
  food: <IconScanFood className={`icon ${classes.icon}`} />,
};

export default function StartButton({ onClick, scanType, type }: Props) {
  const { userDetails } = useContext(UserContext);
  const { demographics } = userDetails || {};
  const { sex } = demographics || {};

  const relevantPlaceholder = useMemo(
    () =>
      placeholders.find(
        (item) =>
          item.sex.includes(sex || "female") && item.scanType === scanType && item.type === type
      ),
    [sex, scanType, type]
  );

  return (
    <UnstyledButton className={classes.container} onClick={onClick}>
      <div className={classes.imageWrapper}>
        <Image
          src={(relevantPlaceholder && relevantPlaceholder.url) || ""}
          className={classes.image}
          alt=""
          width={180}
          height={240}
        />
      </div>
      <Text className={classes.label}>
        {icons[scanType]}Scan {scanType}
      </Text>
    </UnstyledButton>
  );
}
