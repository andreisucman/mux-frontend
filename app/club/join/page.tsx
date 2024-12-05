"use client";

import React, { useCallback, useState } from "react";
import { IconTargetArrow } from "@tabler/icons-react";
import { rem, Stack, Table, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import ClubLegalBody from "@/app/legal/club/ClubLegalBody";
import GlowingButton from "@/components/GlowingButton";
import PageHeader from "@/components/PageHeader";
import TosCheckbox from "@/components/TosCheckbox";
import Confirmation from "./Confirmation";
import classes from "./join.module.css";

export const runtime = "edge";

const tableData = {
  caption: "From their monthly subscription payment",
  head: ["Event", "Reward"],
  body: [["New follower", "25%"]],
};

function openLegalBody() {
  modals.openContextModal({
    centered: true,
    modal: "general",
    size: "md",
    title: (
      <Title order={5} component={"p"}>
        {"Club's Terms of Service"}
      </Title>
    ),
    innerProps: <ClubLegalBody />,
  });
}

export default function ClubJoin() {
  const [tosAccepted, setTosAccepted] = useState(false);
  const [highlightTos, setHighlightTos] = useState(false);

  const onStart = useCallback(() => {
    if (!tosAccepted) {
      setHighlightTos(true);

      const tId = setTimeout(() => {
        setHighlightTos(false);
        clearTimeout(tId);
      }, 6000);
      return;
    }

    modals.openContextModal({
      centered: true,
      modal: "general",
      innerProps: <Confirmation />,
      title: (
        <Title order={5} component={"p"}>
          When you join the Club
        </Title>
      ),
    });
  }, [tosAccepted]);

  return (
    <>
      <Stack className={classes.container}>
        <PageHeader title="Join the Club" hidePartDropdown hideTypeDropdown showReturn />
        <Stack className={classes.wrapper}>
          <Stack className={classes.announcement}>
            <Title order={2}>Welcome</Title>
            <Text ta="center">
              When you join the Club you let other people see your progress to get inspired.
            </Text>
            <Text ta="center">You are rewarded for every user who follows you.</Text>
          </Stack>
          <Table data={tableData} ta={"center"} classNames={{ th: classes.th, td: classes.td }} />
          <TosCheckbox
            highlightTos={highlightTos}
            setHighlightTos={setHighlightTos}
            setTosAccepted={setTosAccepted}
            tosAccepted={tosAccepted}
            openLegalBody={openLegalBody}
          />
          <GlowingButton
            text="Join the Club"
            icon={<IconTargetArrow className="icon" style={{ marginRight: rem(8) }} />}
            onClick={onStart}
          />
        </Stack>
      </Stack>
    </>
  );
}
