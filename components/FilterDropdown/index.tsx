import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconChevronDown } from "@tabler/icons-react";
import cn from "classnames";
import { Group, Menu, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import modifyQuery from "@/helpers/modifyQuery";
import { FilterItemType } from "./types";
import classes from "./FilterDropdown.module.css";

type Props = {
  filterType: string;
  isDisabled?: boolean;
  addToQuery?: boolean;
  data: FilterItemType[];
  defaultSelected?: FilterItemType;
  onSelect?: (item?: FilterItemType) => void;
};

export default function FilterDropdown({
  data,
  isDisabled,
  addToQuery,
  filterType,
  defaultSelected,
  onSelect,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [opened, { open, close }] = useDisclosure(false);
  const [selected, setSelected] = useState(defaultSelected || data[0]);

  const handleSelect = useCallback(
    (item: FilterItemType) => {
      if (!location) return;

      if (addToQuery) {
        const newQuery = modifyQuery({
          params: [{ name: filterType, value: item.value, action: "replace" }],
        });

        router.replace(`${pathname}?${newQuery}`);
      }

      setSelected(item);

      if (onSelect) onSelect(item);
    },
    [pathname, addToQuery]
  );

  const items = useMemo(
    () =>
      data.map((item) => (
        <Menu.Item
          leftSection={item.icon ? <span>{item.icon}</span> : undefined}
          onClick={() => {
            handleSelect(item);
          }}
          key={item.value}
        >
          {item.label}
        </Menu.Item>
      )),
    [data.length]
  );

  return (
    <Menu
      onOpen={open}
      onClose={close}
      radius="md"
      width="target"
      withinPortal
      disabled={isDisabled}
      classNames={{ itemSection: classes.itemSection }}
    >
      <Menu.Target>
        <UnstyledButton
          className={cn(classes.control, { [classes.disabled]: isDisabled })}
          data-expanded={opened || undefined}
        >
          <Group gap="xs">
            {selected.icon}
            <span className={classes.label}>{selected.label}</span>
          </Group>
          <IconChevronDown
            className={cn(classes.icon, { [classes.disabled]: isDisabled })}
            stroke={1.25}
          />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}
