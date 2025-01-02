import React, { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconSortDescending2 } from "@tabler/icons-react";
import { ActionIcon, Checkbox, Menu } from "@mantine/core";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./SortButton.module.css";

type Props = {
  sortItems: { label: string; value: string }[];
  isDisabled?: boolean;
  customStyles?: { [key: string]: any };
};

export default function SortButton({ sortItems, customStyles, isDisabled }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "-createdAt";

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
          checked={sort === item.value}
          size="md"
          label={item.label}
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
          <IconSortDescending2 className="icon" />
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
