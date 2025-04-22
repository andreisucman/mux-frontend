import React, { useMemo, useState } from "react";
import { IconCirclePlus } from "@tabler/icons-react";
import { Checkbox, Group, Menu, rem, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import classes from "./BlurSelectorMenu.module.css";

type Props = {
  selectedValue: string;
  defaultBlurTypes: { value: string; label: string }[];
  handleSelect: (blurType: BlurTypeEnum) => void;
  handleNewBlur: () => void;
  customStyles?: { [key: string]: any };
};

export default function BlurSelectorMenu({
  selectedValue,
  defaultBlurTypes,
  customStyles,
  handleSelect,
  handleNewBlur,
}: Props) {
  const [selectedDisplayType, setSelectedDisplayType] = useState<{
    label: string;
    value: string;
  }>({ label: upperFirst(selectedValue), value: selectedValue });
  const existingValues = defaultBlurTypes.map((item) => item.value);

  const items = useMemo(
    () =>
      defaultBlurTypes.map((item, i) => (
        <Checkbox
          key={i}
          checked={selectedDisplayType?.value === item.value}
          label={item.label}
          onChange={(e) => {
            e.stopPropagation();
            setSelectedDisplayType(item);
            handleSelect(item.value as BlurTypeEnum);
          }}
          readOnly
        />
      )),
    [selectedDisplayType?.value]
  );
  return (
    <Menu
      trigger="click"
      withinPortal={false}
      trapFocus={false}
      classNames={{ dropdown: classes.dropdown }}
    >
      <Menu.Target>
        <Text size="sm" style={customStyles || {}}>
          {selectedDisplayType.label}
        </Text>
      </Menu.Target>
      <Menu.Dropdown>
        {items.map((item, i) => (
          <Menu.Item key={i}>{item}</Menu.Item>
        ))}
        <Menu.Item>
          <Group gap={8} onClick={handleNewBlur}>
            <IconCirclePlus className="icon icon__small" /> New blur
          </Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
