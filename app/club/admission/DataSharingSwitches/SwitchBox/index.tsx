import React, { useMemo } from "react";
import { Group, Stack, Switch } from "@mantine/core";
import { getPrivacyValue } from "@/helpers/clubPrivacy";
import { partIcons } from "@/helpers/icons";
import { getPartIcon, getTypeIcon, typeIcons } from "@/helpers/icons";
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

  const typeIcon = getTypeIcon(relevantTypePrivacy?.name || "", "icon__large");
  const switchedOn = getPrivacyValue({
    privacy,
    type,
    isMain: true,
  });

  const partSwitches = useMemo(() => {
    if (!parts || (parts && parts.length <= 1)) return null;

    return parts.map((part, i) => {
      const switchedOn = getPrivacyValue({
        privacy,
        type,
        partName: part.name,
      });

      const partIcon = partIcons[part.name];

      return (
        <Switch
          key={i}
          label={
            <Group align="center" gap={8}>
              {partIcon} Share {part.name} data
            </Group>
          }
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
  }, [privacy]);

  return (
    <Stack className={classes.container}>
      <Switch
        label={
          <Group align="center" gap={8}>
            {typeIcon} Share {type} data
          </Group>
        }
        size="md"
        checked={switchedOn}
        onChange={(e) => onChange({ value: e.currentTarget.checked, type })}
      />
      {partSwitches && partSwitches.length > 0 && (
        <Stack className={classes.wrapper}>{partSwitches}</Stack>
      )}
    </Stack>
  );
}
