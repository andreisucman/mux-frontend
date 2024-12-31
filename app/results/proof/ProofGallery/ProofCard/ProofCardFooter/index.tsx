import React from "react";
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
  return (
    <Stack className={classes.container}>
      {handleTrack && (
        <div className={classes.buttonWrapper}>
          <GlowingButton
            text={"Peek proof"}
            icon={<IconEye className={"icon"} style={{ marginRight: rem(6) }} />}
            onClick={handleTrack}
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
