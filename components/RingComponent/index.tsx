import { memo } from "react";
import { IconQuestionMark } from "@tabler/icons-react";
import { ActionIcon, RingProgress, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import classes from "./RingComponent.module.css";

type RingComponentProps = {
  ringSize: number;
  data: { value: number; color: string; label: string }[];
  customStyles?: { [key: string]: any };
  isPotential?: boolean;
  showTitle?: boolean;
  fontSize?: number;
  onClick?: (args: any) => void;
};

const RingComponent = ({
  data,
  ringSize,
  fontSize,
  isPotential,
  customStyles,
  showTitle = true,
  onClick,
}: RingComponentProps) => {
  const modelObject = data[0];
  const finalFontSize = fontSize ? fontSize : Math.min(ringSize * 0.12, 24);
  const labelValue = isPotential ? modelObject.value + data[1].value : modelObject.value;

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}} onClick={onClick}>
      {isPotential && (
        <ActionIcon className={classes.actionIcon} variant="default">
          <IconQuestionMark />
        </ActionIcon>
      )}
      <RingProgress
        size={ringSize || 1}
        thickness={ringSize * 0.09 || 1}
        sections={data}
        label={
          <Text className={classes.label} fz={ringSize * 0.25} c="white">
            {labelValue.toFixed(0)}
          </Text>
        }
      />
      {showTitle && (
        <Text fz={finalFontSize} className={classes.label}>
          {upperFirst(modelObject.label)}
        </Text>
      )}
    </Stack>
  );
};

export default memo(RingComponent);
