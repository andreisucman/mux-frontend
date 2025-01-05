"use client";

import React, { useMemo, useState } from "react";
import {
  IconArrowRight,
  IconCamera,
  IconCash,
  IconEye,
  IconLock,
  IconRating18Plus,
  IconTarget,
  IconTargetOff,
} from "@tabler/icons-react";
import { rem, Stack, Table, Text } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import TosCheckbox from "@/components/TosCheckbox";
import openLegalBody from "@/helpers/openLegalBody";
import classes from "./JoinClubConfirmation.module.css";

const confirmData = {
  body: [
    [
      <IconEye className="icon icon__title" />,
      "Joining the Club lets you see the public data of other Club members (if you have the Peek license).",
    ],
    [
      <IconLock className="icon icon__title" />,
      "Nobody can see your data when you join the Club. But you can enable data sharing in the settings.",
    ],
  ],
};

const startData = {
  body: [
    [
      <IconCamera className="icon icon__title" />,
      "All of your uploaded data is private by default. You can make it public in the settings.",
    ],
    [
      <IconCash className="icon icon__title" />,
      "You will earn a share of the subscription fee from each follower. The payments will be deposited to your bank account.",
    ],
    [
      <IconTargetOff className="icon icon__title" />,
      "If you leave the Club the data you've made public (if you made it public) will become private immediately.",
    ],
    [
      <IconRating18Plus className="icon icon__title" />,
      "You must be over 18 years old to join the Club. Your age will be verified during the registration.",
    ],
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
    setIsLoading(false);
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
