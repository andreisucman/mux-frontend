import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconChevronDown } from "@tabler/icons-react";
import { Group, Menu, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./FilterDropdown.module.css";

type ItemType = {
  label: string;
  icon: React.ReactNode;
  value: string;
};

type Props = {
  filterType: string;
  addToQuery?: boolean;
  data: ItemType[];
  defaultSelected?: ItemType;
  onSelectCallback?: (item: ItemType) => void;
};

export default function FilterDropdown({
  data,
  addToQuery,
  filterType,
  defaultSelected,
  onSelectCallback,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [opened, { open, close }] = useDisclosure(false);
  const [selected, setSelected] = useState(defaultSelected || data[0]);

  function handleSelect(item: ItemType) {
    if (addToQuery) {
      const newQuery = modifyQuery({
        params: [{ name: filterType, value: item.value, action: "replace" }],
      });

      router.replace(`/${pathname}?${newQuery}`);
    }
    
    setSelected(item);

    if (onSelectCallback) onSelectCallback(item);
  }

  const items = data.map((item) => (
    <Menu.Item
      leftSection={<span>{item.icon}</span>}
      onClick={() => {
        handleSelect(item);
      }}
      key={item.value}
    >
      {item.label}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={open}
      onClose={close}
      radius="md"
      width="target"
      withinPortal
      classNames={{ itemSection: classes.itemSection }}
    >
      <Menu.Target>
        <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
          <Group gap="xs">
            {selected.icon}
            <span className={classes.label}>{selected.label}</span>
          </Group>
          <IconChevronDown className={classes.icon} stroke={1.25} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}
