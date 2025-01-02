import React, { useState } from "react";
import { IconEye } from "@tabler/icons-react";
import { Group, rem, Stack } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
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
      {handleTrack && (
        <div className={classes.buttonWrapper}>
          <GlowingButton
            text={"Peek proof"}
            loading={isLoading}
            disabled={isLoading}
            icon={<IconEye className={"icon"} style={{ marginRight: rem(6) }} />}
            onClick={handleClick}
          />
        </div>
      )}
      {metaPanel}
      <Group className={classes.footer}>
        <span>{formattedDate}</span>
        {disclaimer && disclaimer}
      </Group>
    </Stack>
  );
}
