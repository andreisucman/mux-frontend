import React, { useContext, useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import cn from "classnames";
import { Skeleton, Text, UnstyledButton, useComputedColorScheme } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { UserContext } from "@/context/UserContext";
import { placeholders } from "@/data/placeholders";
import classes from "./StartButton.module.css";

type Props = {
  onClick: () => void;
  part: "face" | "hair" | "body";
  isFirst?: boolean;
};

export default function StartButton({ onClick, part }: Props) {
  const computedColorScheme = useComputedColorScheme("light");

  const [pageLoaded, setPageLoaded] = useState(false);
  const [relevantPlaceholder, setRelevantPlaceholder] = useState<StaticImageData>();
  const { userDetails } = useContext(UserContext);
  const { demographics } = userDetails || {};
  const { sex } = demographics || {};

  useEffect(() => {
    if (!pageLoaded || !computedColorScheme) return;

    const relevantPlaceholder = placeholders.find(
      (item) =>
        item.sex.includes(sex || "female") &&
        item.part === part &&
        item.scheme === computedColorScheme
    );
    setRelevantPlaceholder(relevantPlaceholder?.url);
  }, [sex, computedColorScheme, pageLoaded]);

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
      <Text className={cn(classes.label)}>{upperFirst(part)}</Text>
    </UnstyledButton>
  );
}
