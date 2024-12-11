import React from "react";
import { IconEye } from "@tabler/icons-react";
import { Group, Stack } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import classes from "./ProofCardFooter.module.css";

type Props = {
  disclaimer?: React.ReactNode | string;
  metaPanel?: React.ReactNode;
  formattedDate?: string;
  isTracked?: boolean;
  handleTrack?: () => void;
};

export default function ProofCardFooter({
  disclaimer,
  metaPanel,
  isTracked,
  formattedDate,
  handleTrack,
}: Props) {
  return (
    <Stack className={classes.container}>
      {handleTrack && (
        <div className={classes.buttonWrapper}>
          <GlowingButton
            text={"Peek the routine"}
            addGradient={!isTracked}
            disabled={isTracked}
            icon={<IconEye className={"icon"} />}
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
