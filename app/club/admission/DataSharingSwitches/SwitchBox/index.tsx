import React, { useMemo } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import { ActionIcon, Group, Stack, Switch, Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { getPrivacyValue } from "@/helpers/clubPrivacy";
import { getCategoryIcon, getTypeIcon } from "@/helpers/icons";
import { HeadValuePartsBoolean } from "@/types/global";
import { tooltipDescriptions } from "../tooltipDescriptions";
import classes from "./SwitchBox.module.css";

type OnChangeProps = {
  value: boolean;
  category: string;
  type?: string;
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

  const types = relevantCategoryPrivacy?.types;

  const typeSwitches = useMemo(() => {
    if (!types || (types && types.length <= 1)) return null;

    return types.map((type, i) => {
      const switchedOn = getPrivacyValue({
        privacy,
        type: type.name,
        category,
      });

      const typeIcon = getTypeIcon(type.name, "icon");

      return (
        <Switch
          key={i}
          label={
            <Group align="center" gap={8}>
              {typeIcon} Share {type.name} data
            </Group>
          }
          checked={switchedOn}
          onChange={(e) =>
            onChange({
              value: e.currentTarget.checked,
              category,
              type: type.name,
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
      {typeSwitches && typeSwitches.length > 0 && (
        <Stack className={classes.wrapper}>{typeSwitches}</Stack>
      )}
    </Stack>
  );
}
