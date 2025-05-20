import React from "react";
import { Stack, Title } from "@mantine/core";
import RoutinesFilterCardContent from "@/app/routines/RoutinesFilterCardContent";
import { FilterItemType } from "@/components/FilterDropdown/types";
import classes from "./SelectPartOrConcern.module.css";

type Props = {
  partFilterItems: FilterItemType[];
  concernFilterItems: FilterItemType[];
};

export default function SelectPartOrConcern({ partFilterItems, concernFilterItems }: Props) {
  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        <Title order={5}>Nothing found</Title>
        <RoutinesFilterCardContent
          partFilterItems={partFilterItems}
          concernFilterItems={concernFilterItems}
          hideClear
        />
      </Stack>
    </Stack>
  );
}
