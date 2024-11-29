import React from "react";
import { IconEye } from "@tabler/icons-react";
import cn from "classnames";
import { Group, Stack, Text } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import classes from "./ProofCardFooter.module.css";

type Props = {
  concernName: string;
  disclaimer?: React.ReactNode | string;
  metaPanel?: React.ReactNode;
  formattedDate: string;
  isModal?: boolean;
  showConcern: boolean;
  showButton: boolean;
  isTracked?: boolean;
  handleTrack?: () => void;
};

export default function ProofCardFooter({
  concernName,
  disclaimer,
  metaPanel,
  isTracked,
  isModal,
  formattedDate,
  showConcern,
  showButton,
  handleTrack,
}: Props) {
  return (
    <Stack className={classes.container}>
      {showConcern && (
        <div
          className={cn(classes.concernContainer, {
            [classes.modalContainer]: isModal,
          })}
        >
          <Text className={classes.text}>{`❗ ${concernName}`}</Text>
        </div>
      )}
      {showButton && handleTrack && (
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
