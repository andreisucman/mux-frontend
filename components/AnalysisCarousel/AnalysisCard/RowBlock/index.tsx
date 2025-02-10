import React, { useState } from "react";
import { Collapse, Divider, Group, Stack, Text } from "@mantine/core";
import RingComponent from "@/components/RingComponent";
import classes from "./RowBlock.module.css";

type Props = {
  titleObject: { label: string; value: number; color: string }[];
  ringsGroup: { label: string; value: number; color: string }[][];
  explanations: { [key: string]: string };
};

export default function RowBlock({ titleObject, ringsGroup, explanations }: Props) {
  const [openCollapse, setOpenCollapse] = useState(true);
  return (
    <Stack className={classes.container}>
      <Divider
        label={<RingComponent data={titleObject} fontSize={16} ringSize={100} />}
        labelPosition="center"
        onClick={() => setOpenCollapse((prev) => !prev)}
      />
      <Collapse in={openCollapse} className={classes.stack}>
        {ringsGroup.map((ring, index) => (
          <Group className={classes.row} key={index}>
            <RingComponent data={ring} ringSize={75} />
            <Text>{explanations[ring[0].label]}</Text>
          </Group>
        ))}
      </Collapse>
    </Stack>
  );
}
