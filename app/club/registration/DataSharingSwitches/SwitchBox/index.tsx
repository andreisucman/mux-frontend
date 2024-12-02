import React, { useMemo } from "react";
import { Stack, Switch } from "@mantine/core";
import { partIconMap } from "@/context/CreateRoutineContext/SelectPartForRoutineModalContent/partIconMap";
import { getPrivacyValue } from "@/helpers/clubPrivacy";
import { HeadValuePartsBoolean } from "@/types/global";
import classes from "./SwitchBox.module.css";

type OnChangeProps = {
  value: boolean;
  type: string;
  part?: string;
};

type Props = {
  privacy?: HeadValuePartsBoolean;
  type: string;
  onChange: (props: OnChangeProps) => Promise<void>;
};

export default function SwitchBox({ privacy, type, onChange }: Props) {
  const relevantTypePrivacy = privacy?.find((rec) => rec.name === type);
  const parts = relevantTypePrivacy?.parts;

  const icon = partIconMap[relevantTypePrivacy?.name || ""];
  const switchedOn = getPrivacyValue({
    privacy,
    type,
    isMain: true,
  });

  const partSwitches = useMemo(() => {
    if (!parts || (parts && parts.length === 0)) return <></>;

    return parts.map((part, i) => {
      const switchedOn = getPrivacyValue({
        privacy,
        type,
        partName: part.name,
      });

      return (
        <Switch
          key={i}
          label={`${partIconMap[part.name]} Share ${part.name} data`}
          checked={switchedOn}
          onChange={(e) =>
            onChange({
              value: e.currentTarget.checked,
              part: part.name,
              type,
            })
          }
        />
      );
    });
  }, [typeof parts]);

  return (
    <Stack className={classes.container}>
      <Switch
        label={`${icon} Share ${type} data`}
        size="md"
        checked={switchedOn}
        onChange={(e) => onChange({ value: e.currentTarget.checked, type })}
      />
      <Stack className={classes.wrapper}>{partSwitches}</Stack>
    </Stack>
  );
}
