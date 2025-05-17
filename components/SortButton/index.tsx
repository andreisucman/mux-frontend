import React, { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconSortDescending2 } from "@tabler/icons-react";
import { ActionIcon, Checkbox, Menu } from "@mantine/core";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./SortButton.module.css";

type Props = {
  sortItems: { label: string; value: string }[];
  customStyles?: { [key: string]: any };
  isDisabled?: boolean;
  defaultSortValue?: string;
};

export default function SortButton({
  sortItems,
  defaultSortValue = "-createdAt",
  customStyles,
  isDisabled = sortItems.length === 0,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || defaultSortValue;

  const handleSelect = async (value: string) => {
    if (value === sort) return;
    const query = modifyQuery({ params: [{ name: "sort", value, action: "replace" }] });
    router.replace(`${pathname}${query ? `?${query}` : ""}`);
  };

  const items = useMemo(
    () =>
      sortItems.map((item, i) => (
        <Checkbox
          key={i}
          label={item.label}
          checked={sort === item.value}
          onChange={() => handleSelect(item.value)}
          readOnly
        />
      )),
    [sort]
  );

  return (
    <Menu
      trigger="click"
      withinPortal={false}
      trapFocus={false}
      disabled={isDisabled}
      classNames={{ dropdown: classes.dropdown }}
    >
      <Menu.Target>
        <ActionIcon
          variant="default"
          className={classes.target}
          style={customStyles || {}}
          disabled={isDisabled}
        >
          <IconSortDescending2 size={20} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {items.map((item, i) => (
          <Menu.Item key={i}>{item}</Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
