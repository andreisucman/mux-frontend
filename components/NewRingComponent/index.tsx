import { memo } from "react";
import { RingProgress, Stack, Text } from "@mantine/core";
import classes from "./NewRingComponent.module.css";

type NewRingComponentProps = {
  ringSize: number;
  label: string;
  sections: { value: number; label: string; color: string }[];
};

const NewRingComponent = ({ sections, label, ringSize }: NewRingComponentProps) => {
  return (
    <Stack className={classes.container}>
      <RingProgress
        size={ringSize}
        thickness={ringSize * 0.1}
        sections={sections}
        label={
          <Text className={classes.label} fz={24} c="white">
            {sections[0].value}
          </Text>
        }
      />
      <Text className={classes.label} fz={18} c="white">
        {label}
      </Text>
    </Stack>
  );
};

export default memo(NewRingComponent);
