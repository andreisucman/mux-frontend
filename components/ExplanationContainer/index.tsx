import React, { useMemo } from "react";
import { Stack, Text } from "@mantine/core";
import classes from "./ExplanationContainer.module.css";

type Props = {
  title: string;
  text?: string;
  size?: string;
  customStyles?: { [key: string]: any };
  customClass?: string;
};

export default function ExplanationContainer({
  title,
  text,
  customClass,
  customStyles,
  size = "md",
}: Props) {
  const textArray = useMemo(() => text?.split("\n"), [text]);

  return (
    <Stack
      className={customClass ? `${classes.container} ${classes[customClass]}` : classes.container}
      style={customStyles ? customStyles : {}}
    >
      {title && (
        <Text className={classes.title} c="dimmed">
          {title}
        </Text>
      )}

      {textArray?.map((textRow, index) => (
        <Text key={index} size={size} className={classes.description}>
          {textRow}
        </Text>
      ))}
    </Stack>
  );
}
