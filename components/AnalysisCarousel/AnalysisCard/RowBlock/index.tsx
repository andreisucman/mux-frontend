import React from "react";
import { Divider, Group, Stack, Text } from "@mantine/core";
import RingComponent from "@/components/RingComponent";
import classes from "./RowBlock.module.css";

type Props = {
  titleObject: { label: string; value: number; color: string }[];
  ringsGroup: { label: string; value: number; color: string }[][];
  explanations: { [key: string]: string };
};

export default function RowBlock({ titleObject, ringsGroup, explanations }: Props) {
  return (
    <Stack className={classes.container}>
      <Divider
        label={<RingComponent onClick={() => {}} data={titleObject} ringSize={100} />}
        labelPosition="center"
      />
      {ringsGroup.map((ring, index) => (
        <Group className={classes.row} key={index}>
          <RingComponent onClick={() => {}} data={ring} ringSize={75} />
          <Text>{explanations[ring[0].label]}</Text>
        </Group>
      ))}
    </Stack>
  );
}
