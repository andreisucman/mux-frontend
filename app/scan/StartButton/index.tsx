import React, { useContext, useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Skeleton, Text, UnstyledButton } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import { placeholders } from "@/data/placeholders";
import { getPartIcon } from "@/helpers/icons";
import classes from "./StartButton.module.css";

type Props = {
  onClick: () => void;
  part: "face" | "hair";
};

export default function StartButton({ onClick, part }: Props) {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [relevantPlaceholder, setRelevantPlaceholder] = useState<StaticImageData>();
  const { userDetails } = useContext(UserContext);
  const { demographics } = userDetails || {};
  const { sex } = demographics || {};

  useEffect(() => {
    if (!pageLoaded) return;

    const relevantPlaceholder = placeholders.find(
      (item) => item.sex.includes(sex || "female") && item.part === part
    );
    setRelevantPlaceholder(relevantPlaceholder?.url);
  }, [sex, pageLoaded]);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const icon = getPartIcon(part);

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
        {icon} Scan {part}
      </Text>
    </UnstyledButton>
  );
}
