import React from "react";
import { Group, Title } from "@mantine/core";
import { createSpotlight } from "@mantine/spotlight";
import SearchButton from "@/components/SearchButton";
import classes from "./SolutionsHeader.module.css";

const [spotlightStore, solutionsSpotlight] = createSpotlight();

export default function SolutionsHeader() {
  return (
    <Group className={classes.container}>
      <Title order={1} lineClamp={2} mr="auto">
        Solutions
      </Title>
      <SearchButton
        spotlightStore={spotlightStore}
        spotlight={solutionsSpotlight}
        collection={"solution"}
        searchPlaceholder="Search solutions"
        showActivityIndicator
        forceEnabled
      />
    </Group>
  );
}
