"use client";

import React, { useMemo, useState } from "react";
import { IconCamera, IconCash, IconEye, IconLock, IconTargetOff } from "@tabler/icons-react";
import { rem, Stack, Table, Text } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import TosCheckbox from "@/components/TosCheckbox";
import openLegalBody from "@/helpers/openLegalBody";
import classes from "./JoinClubConfirmation.module.css";

const confirmData = {
  body: [
    [
      <IconEye className="icon icon__big" style={{display: "flex"}} />,
      "Joining the Club lets you access other Club members.",
    ],
    [<IconLock className="icon icon__big" style={{display: "flex"}} />, "Your data is private when you join the Club."],
  ],
};

const startData = {
  body: [
    [
      <IconCamera className="icon icon__big" style={{display: "flex"}} />,
      "All of your data remains private.",
    ],
    [
      <IconCash className="icon icon__big" style={{display: "flex"}} />,
      "You can buy other members' routines or sell yours.",
    ],
    [<IconTargetOff className="icon icon__big" style={{display: "flex"}} />, "You can leave at any time."],
  ],
};

type Props = {
  description?: string;
  type: "start" | "confirm";
  handleJoinClub: () => Promise<void>;
};

export default function JoinClubConfirmation({ handleJoinClub, description, type }: Props) {
  const [tosAccepted, setTosAccepted] = useState(false);
  const [highlightTos, setHighlightTos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;

    if (!tosAccepted) {
      setHighlightTos(true);

      const tId = setTimeout(() => {
        setHighlightTos(false);
        clearTimeout(tId);
      }, 6000);

      return;
    }

    setIsLoading(true);
    await handleJoinClub();
  };

  const checkboxLabel = useMemo(
    () => (
      <Text lineClamp={2} size="sm">
        I have read, understood and accept the{" "}
        <span
          onClickCapture={() => openLegalBody("club")}
          style={{ cursor: "pointer", fontWeight: 600 }}
        >{`Club's Terms of Service`}</span>
      </Text>
    ),
    []
  );

  const buttonText = type === "start" ? "Join the Club" : "Join and proceed to checkout";

  return (
    <Stack flex={1}>
      {description && <Text className={classes.description}>{description}</Text>}
      <Table
        data={type === "start" ? startData : confirmData}
        classNames={{ td: classes.td, th: classes.th }}
      />
      <Stack className={classes.actionWrapper}>
        <TosCheckbox
          label={checkboxLabel}
          tosAccepted={tosAccepted}
          highlightTos={highlightTos}
          setHighlightTos={setHighlightTos}
          setTosAccepted={setTosAccepted}
          customStyles={{ marginTop: rem(-8) }}
        />

        <GlowingButton
          text={buttonText}
          disabled={isLoading}
          loading={isLoading}
          iconPosition={type === "start" ? "left" : "right"}
          containerStyles={{ margin: "auto", width: "100%", maxWidth: rem(300) }}
          onClick={handleClick}
        />
      </Stack>
    </Stack>
  );
}
