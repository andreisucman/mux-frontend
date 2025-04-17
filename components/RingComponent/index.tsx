import { memo } from "react";
import { RingProgress, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import classes from "./RingComponent.module.css";

type RingComponentProps = {
  ringSize: number;
  data: { value: number; color: string; label: string }[];
  customStyles?: { [key: string]: any };
  showTitle?: boolean;
  fontSize?: number;
};

const RingComponent = ({
  data,
  ringSize,
  customStyles,
  fontSize = 14,
  showTitle = true,
}: RingComponentProps) => {
  const modelObject = data[0];
  const labelValue = modelObject.value;

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <RingProgress
        size={ringSize || 1}
        thickness={ringSize * 0.09 || 1}
        sections={data}
        label={
          <Text className={classes.label} fz={ringSize * 0.25} c="white">
            {labelValue.toFixed(0)}
          </Text>
        }
        rootColor={"light-dark(var(--mantine-color-gray-4),var(--mantine-color-dark-4))"}
      />
      {showTitle && (
        <Text fz={fontSize} c="dimmed" className={classes.label}>
          {upperFirst(modelObject.label)}
        </Text>
      )}
    </Stack>
  );
};

export default memo(RingComponent);
