import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconCheck } from "@tabler/icons-react";
import { Group, Select, SelectProps } from "@mantine/core";
import modifyQuery from "@/helpers/modifyQuery";
import { FilterItemType } from "./types";

type Props = {
  icons?: { [key: string]: React.ReactNode };
  placeholder: string;
  filterType?: string;
  isDisabled?: boolean;
  addToQuery?: boolean;
  data: FilterItemType[];
  defaultSelected?: string;
  onSelect?: (key?: string | null) => void;
};

export default function FilterDropdown({
  data,
  icons,
  placeholder,
  isDisabled,
  addToQuery,
  filterType,
  defaultSelected,
  onSelect,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const defaultValue = defaultSelected || data[0].value;

  const handleSelect = useCallback(
    (key: string | null) => {
      if (addToQuery && filterType) {
        const newQuery = modifyQuery({
          params: [{ name: filterType, value: key, action: "replace" }],
        });

        router.replace(`${pathname}?${newQuery}`);
      }

      if (onSelect) onSelect(key);
    },
    [pathname, addToQuery]
  );

  const renderSelectOption: SelectProps["renderOption"] = ({ option, checked }) => (
    <Group flex="1" gap="xs">
      {icons && icons[option.value]}
      {option.label}
      {checked && <IconCheck style={{ marginInlineStart: "auto" }} className="icon" />}
    </Group>
  );

  return (
    <Select
      data={data}
      disabled={isDisabled}
      placeholder={placeholder}
      renderOption={renderSelectOption}
      onChange={handleSelect}
      defaultValue={defaultValue}
    />
  );
}
