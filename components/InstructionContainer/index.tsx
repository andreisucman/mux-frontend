import React from "react";
import { IconExclamationCircle } from "@tabler/icons-react";
import { Group, Skeleton, Stack, Text } from "@mantine/core";
import classes from "./InstructionContainer.module.css";

type Props = {
  title?: string;
  description?: string;
  instruction?: string;
  customStyles?: { [key: string]: any };
};

export default function InstructionContainer({
  title,
  instruction,
  description,
  customStyles,
}: Props) {
  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Skeleton className="skeleton" visible={!instruction}>
        {instruction && (
          <Stack className={classes.meta} style={instruction ? {} : { visibility: "hidden" }}>
            {title && (
              <Text size="xs" c="dimmed">
                {title}
              </Text>
            )}
            <Text className={classes.description}>{instruction}</Text>
          </Stack>
        )}
        {description && (
          <Group className={classes.note} style={instruction ? {} : { visibility: "hidden" }}>
            <IconExclamationCircle
              color="var(--mantine-color-orange-6)"
              className={`${classes.icon} icon`}
            />
            <Text size="sm" c="orange.6">
              {description}
            </Text>
          </Group>
        )}
      </Skeleton>
    </Stack>
  );
}
