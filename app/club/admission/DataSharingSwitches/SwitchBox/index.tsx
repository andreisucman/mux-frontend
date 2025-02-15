import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IconChevronDown, IconChevronUp, IconInfoCircle } from "@tabler/icons-react";
import { ActionIcon, Collapse, Group, rem, Stack, Switch, Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { getPrivacyValue } from "@/helpers/clubPrivacy";
import { getCategoryIcon, getPartIcon } from "@/helpers/icons";
import { getFromIndexedDb, saveToIndexedDb } from "@/helpers/indexedDb";
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
  const [openCollapse, setOpenCollapse] = useState(false);
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

  const handleToggleCollapse = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (!partswitches || partswitches.length === 1) return;
    setOpenCollapse((prev) => {
      saveToIndexedDb(`openPrivacyCollapse-${category}`, !prev);
      return !prev;
    });
  };

  useEffect(() => {
    getFromIndexedDb(`openPrivacyCollapse-${category}`).then((verdict) => {
      if (verdict === undefined || verdict === null) verdict = true;
      setOpenCollapse(verdict);
    });
  }, [category]);

  const chevron = openCollapse ? (
    <IconChevronUp className={`${classes.chevron} icon`} onClick={handleToggleCollapse} />
  ) : (
    <IconChevronDown className={`${classes.chevron} icon`} onClick={handleToggleCollapse} />
  );

  return (
    <Stack className={classes.container}>
      <Group className={classes.switchRow}>
        <Switch
          label={
            <Group className={classes.categorySwitchLabel}>
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
        {partswitches && partswitches.length > 1 && chevron}
      </Group>

      {partswitches && partswitches.length > 0 && (
        <Collapse in={openCollapse}>
          <Stack className={classes.stack}>{partswitches}</Stack>
        </Collapse>
      )}
    </Stack>
  );
}
