import React, { useContext, useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { IconBodyScan } from "@tabler/icons-react";
import { Skeleton, Text, UnstyledButton } from "@mantine/core";
import { IconScanFood } from "@/components/customIcons";
import { UserContext } from "@/context/UserContext";
import { placeholders } from "@/data/placeholders";
import { ScanTypeEnum } from "@/types/global";
import classes from "./StartButton.module.css";

type Props = {
  scanType: ScanTypeEnum;
  onClick: () => void;
  part: "body" | "food";
};

const icons: { [key: string]: React.ReactNode } = {
  progress: <IconBodyScan className="icon icon__large" />,
  food: <IconScanFood className={`icon ${classes.icon}`} />,
};

export default function StartButton({ onClick, scanType, part }: Props) {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [relevantPlaceholder, setRelevantPlaceholder] = useState<StaticImageData>();
  const { userDetails } = useContext(UserContext);
  const { demographics } = userDetails || {};
  const { sex } = demographics || {};

  useEffect(() => {
    if (!pageLoaded) return;

    const relevantPlaceholder = placeholders.find(
      (item) =>
        item.sex.includes(sex || "female") && item.scanType === scanType && item.part === part
    );
    setRelevantPlaceholder(relevantPlaceholder?.url);
  }, [sex, pageLoaded, scanType]);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <UnstyledButton className={classes.container} onClick={onClick}>
      <Skeleton visible={!relevantPlaceholder}>
        <div className={classes.imageWrapper}>
          {relevantPlaceholder && (
            <Image
              src={relevantPlaceholder}
              className={classes.image}
              alt=""
              width={180}
              height={240}
            />
          )}
        </div>
      </Skeleton>
      <Text className={classes.label}>
        {icons[scanType]}Scan {scanType}
      </Text>
    </UnstyledButton>
  );
}
