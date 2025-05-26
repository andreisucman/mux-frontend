import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconCheck } from "@tabler/icons-react";
import { Group, Select, SelectProps } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import modifyQuery from "@/helpers/modifyQuery";
import { FilterItemType } from "./types";
import classes from "./FilterDropdown.module.css";

type Props = {
  size?: "xs" | "sm";
  data?: FilterItemType[];
  icons?: { [key: string]: React.ReactNode };
  placeholder: string;
  filterType?: string;
  isDisabled?: boolean;
  addToQuery?: boolean;
  searchable?: boolean;
  searchValue?: string;
  allowDeselect?: boolean;
  closeOnSelect?: boolean;
  selectedValue?: string | null;
  onSelect?: (key?: string | null) => void;
  customStyles?: { [key: string]: any };
};

export default function FilterDropdown({
  data,
  size = "sm",
  icons,
  searchable,
  allowDeselect,
  searchValue,
  placeholder,
  isDisabled = data?.length === 0,
  addToQuery,
  filterType,
  selectedValue,
  customStyles,
  closeOnSelect = false,
  onSelect,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const icon = icons && icons[selectedValue || ""];

  const handleSelect = useCallback(
    (newValue: string | null) => {
      if (addToQuery) {
        const params = [];

        if (allowDeselect) {
          if (filterType) {
            params.push({
              name: filterType,
              value: newValue,
              action: newValue ? "replace" : "delete",
            });
          }
        } else {
          if (filterType) {
            if (newValue) {
              params.push({ name: filterType, value: newValue, action: "replace" });
            }
          }
        }

        const newQuery = modifyQuery({
          params,
        });

        router.replace(`${pathname}?${newQuery}`);
      }

      if (onSelect) onSelect(newValue);
      if (closeOnSelect) modals.closeAll();
    },
    [pathname, selectedValue, closeOnSelect, addToQuery, allowDeselect, onSelect]
  );

  const renderSelectOption: SelectProps["renderOption"] = ({ option, checked }) => {
    return (
      <Group className={classes.dropdownRow}>
        {icons && icons[option.value]}
        {upperFirst(option.label)}
        {checked && <IconCheck style={{ marginInlineStart: "auto" }} size={20} />}
      </Group>
    );
  };

  return (
    <Select
      className={classes.container}
      size={size}
      data={data}
      disabled={isDisabled}
      placeholder={placeholder}
      renderOption={renderSelectOption}
      onChange={handleSelect}
      value={selectedValue}
      leftSection={icon}
      leftSectionWidth={40}
      withScrollArea={false}
      searchValue={searchValue}
      searchable={searchable}
      style={customStyles ? customStyles : {}}
      classNames={{
        dropdown: classes.dropdown,
        option: classes.option,
        section: classes.section,
      }}
      allowDeselect={allowDeselect}
    />
  );
}
