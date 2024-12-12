import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconCheck } from "@tabler/icons-react";
import { Group, Select, SelectProps } from "@mantine/core";
import modifyQuery from "@/helpers/modifyQuery";
import { FilterItemType } from "./types";
import classes from "./FilterDropdown.module.css";

type Props = {
  icons?: { [key: string]: React.ReactNode };
  placeholder: string;
  filterType: string;
  isDisabled?: boolean;
  addToQuery?: boolean;
  allowDeselect?: boolean;
  data: FilterItemType[];
  defaultSelected?: string | null;
  onSelect?: (key?: string | null) => void;
  customStyles?: { [key: string]: any };
};

export default function FilterDropdown({
  data,
  icons,
  allowDeselect,
  placeholder,
  isDisabled,
  addToQuery,
  filterType,
  defaultSelected,
  customStyles,
  onSelect,
}: Props) {
  const [icon, setIcon] = useState<React.ReactNode>();
  const [selectedValue, setSelectedValue] = useState<string | null>();
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = useCallback(
    (newValue: string | null) => {
      if (addToQuery) {
        const params = [];

        if (allowDeselect) {
          params.push({
            name: filterType,
            value: newValue,
            action: newValue ? "replace" : "delete",
          });
        } else {
          params.push({ name: filterType, value: newValue, action: "replace" });
        }

        if (filterType === "type" && newValue) {
          params.push({ name: "part", value: null, action: "delete" });
        }

        const newQuery = modifyQuery({
          params,
        });

        router.replace(`${pathname}?${newQuery}`);
      }

      setSelectedValue(newValue);
      if (onSelect) onSelect(newValue);
    },
    [pathname, addToQuery, allowDeselect]
  );

  const renderSelectOption: SelectProps["renderOption"] = ({ option, checked }) => {
    return (
      <Group flex="1" gap="xs">
        {icons && icons[option.value]}
        {option.label}
        {checked && <IconCheck style={{ marginInlineStart: "auto" }} className="icon" />}
      </Group>
    );
  };

  useEffect(() => {
    setSelectedValue(defaultSelected);

    const value = selectedValue || defaultSelected;

    setIcon(value && icons ? icons[value] : undefined);
  }, [defaultSelected, selectedValue]);

  return (
    <Select
      className={classes.container}
      data={data}
      disabled={isDisabled}
      placeholder={placeholder}
      renderOption={renderSelectOption}
      onChange={handleSelect}
      value={selectedValue}
      leftSection={icon}
      leftSectionWidth={40}
      withScrollArea={false}
      style={customStyles ? customStyles : {}}
      classNames={{ dropdown: classes.dropdown, option: classes.option }}
      allowDeselect={allowDeselect}
    />
  );
}
