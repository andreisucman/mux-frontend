import React, { useMemo } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import { ActionIcon, Group, Stack, Switch, Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { getPrivacyValue } from "@/helpers/clubPrivacy";
import { getCategoryIcon, getPartIcon } from "@/helpers/icons";
import { HeadValuePartsBoolean } from "@/types/global";
import { tooltipDescriptions } from "../tooltipDescriptions";
import classes from "./SwitchBox.module.css";

type OnChangeProps = {
  value: boolean;
  category: string;
  part?: string;
};

type Props = {
  privacy?: HeadValuePartsBoolean;
  category: string;
  openTooltip: string;
  setOpenTooltip: React.Dispatch<React.SetStateAction<string>>;
  onChange: (props: OnChangeProps) => Promise<void>;
};

export default function SwitchBox({
  openTooltip,
  category,
  privacy,
  onChange,
  setOpenTooltip,
}: Props) {
  const clickOutsideRef = useClickOutside(() => setOpenTooltip(""));
  const relevantCategoryPrivacy = privacy?.find((rec) => rec.name === category);

  const categoryIcon = getCategoryIcon(category, "icon__large");
  const switchedOn = getPrivacyValue({
    privacy,
    category,
    isMain: true,
  });

  const parts = relevantCategoryPrivacy?.parts;

  const partswitches = useMemo(() => {
    if (!parts || (parts && parts.length <= 1)) return null;

    return parts.map((part, i) => {
      const switchedOn = getPrivacyValue({
        privacy,
        part: part.name,
        category,
      });

      const partIcon = getPartIcon(part.name, "icon");

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
              category,
              part: part.name,
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
            {categoryIcon} Share {category} data
            <Tooltip
              ref={clickOutsideRef}
              label={tooltipDescriptions[category]}
              opened={openTooltip === category}
              onClick={() => setOpenTooltip((prev) => (prev === category ? "" : category))}
              multiline
            >
              <ActionIcon variant="default">
                <IconInfoCircle className="icon" />
              </ActionIcon>
            </Tooltip>
          </Group>
        }
        size="md"
        checked={switchedOn}
        onChange={(e) => onChange({ value: e.currentTarget.checked, category })}
      />
      {partswitches && partswitches.length > 0 && (
        <Stack className={classes.wrapper}>{partswitches}</Stack>
      )}
    </Stack>
  );
}
