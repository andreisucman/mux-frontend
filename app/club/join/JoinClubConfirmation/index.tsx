"use client";

import React, { useMemo, useState } from "react";
import { IconCash, IconCashBanknote, IconDoorExit, IconLock, IconMoneybag, IconRoute, IconTrophy } from "@tabler/icons-react";
import { Alert, rem, Stack, Table, Text } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import TosCheckbox from "@/components/TosCheckbox";
import openLegalBody from "@/helpers/openLegalBody";
import classes from "./JoinClubConfirmation.module.css";

const confirmData = {
  body: [
    [
      <IconLock className="icon icon__big" style={{ display: "flex" }} />,
      "All of your data remains private.",
    ],
    [
      <IconCash className="icon icon__big" style={{ display: "flex" }} />,
      "You can buy other members' routines or sell yours.",
    ],
    [
      <IconTrophy className="icon icon__big" style={{ display: "flex" }} />,
      "You can claim activity rewards.",
    ],
    [
      <IconDoorExit className="icon icon__big" style={{ display: "flex" }} />,
      "You can leave at any time.",
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

  const buttonText = type === "start" ? "Join the Club" : "Join and checkout";

  return (
    <Stack flex={1} gap={12}>
      {description && <Alert ta="center" p="0.5rem 1rem">{description}</Alert>}
      <Table data={confirmData} classNames={{ td: classes.td, th: classes.th }} />
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
          containerStyles={{ margin: "auto", width: "100%", maxWidth: rem(200) }}
          onClick={handleClick}
        />
      </Stack>
    </Stack>
  );
}
