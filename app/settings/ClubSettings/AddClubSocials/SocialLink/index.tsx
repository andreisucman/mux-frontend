import React, { memo } from "react";
import { IconX } from "@tabler/icons-react";
import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import classes from "./SocialLink.module.css";

type Props = {
  label: string;
  value: string | null;
  deleteSocial: (value: string | null) => void;
};

function SocialLink({ label, value, deleteSocial }: Props) {
  return (
    <Group className={classes.container}>
      <Stack className={classes.stack}>
        {label && (
          <Text size="xs" c="dimmed">
            {label}
          </Text>
        )}
        <Text lineClamp={1}>{value}</Text>
      </Stack>
      <ActionIcon size="sm" variant="default" onClick={() => deleteSocial(value)}>
        <IconX className="icon icon__small" />
      </ActionIcon>
    </Group>
  );
}

export default memo(SocialLink);
