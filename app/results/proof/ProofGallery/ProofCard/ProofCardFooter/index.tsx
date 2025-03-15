import React, { useState } from "react";
import { Group, Stack } from "@mantine/core";
import classes from "./ProofCardFooter.module.css";

type Props = {
  disclaimer?: React.ReactNode | string;
  metaPanel?: React.ReactNode;
  formattedDate?: string;
  handleTrack?: () => void;
};

export default function ProofCardFooter({
  disclaimer,
  metaPanel,
  formattedDate,
  handleTrack,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    if (handleTrack) {
      await handleTrack();
    }
    setIsLoading(false);
  };

  return (
    <Stack className={classes.container}>
      {metaPanel}
      <Group className={classes.footer}>
        <span>{formattedDate}</span>
        {disclaimer && disclaimer}
      </Group>
    </Stack>
  );
}
