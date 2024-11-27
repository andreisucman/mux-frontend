import { useState } from "react";
import { Combobox, Input, InputBase, Loader, Text, useCombobox } from "@mantine/core";
import { FilterItemType } from "./FilterDropdown/types";

type Props = {
  handleSelectItem: (item: FilterItemType) => void;
  fetchData: () => Promise<FilterItemType[]>;
};

export default function SelectAsync({ fetchData, handleSelectItem }: Props) {
  const [value, setValue] = useState<FilterItemType | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FilterItemType[]>([]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => {
      if (data.length === 0 && !loading) {
        setLoading(true);
        fetchData().then((response) => {
          setData(response);
          setLoading(false);
          combobox.resetSelectedOption();
        });
      }
    },
  });

  const options = data.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      {item.icon} {item.label}
    </Combobox.Option>
  ));

  const initialValue = value ? (
    <Text component={"div"}>
      {value.icon} {value.label}
    </Text>
  ) : null;

  return (
    <Combobox
      store={combobox}
      withinPortal={true}
      onOptionSubmit={(val) => {
        const relevantItem = data.find((item) => item.value === val);
        setValue(relevantItem || null);
        if (relevantItem) handleSelectItem(relevantItem);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          rightSection={loading ? <Loader size={18} /> : <Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          component="button"
          type="button"
          pointer
        >
          {initialValue || <Input.Placeholder>Pick value</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {loading ? (
            <Combobox.Empty>Loading...</Combobox.Empty>
          ) : options.length > 0 ? (
            options
          ) : (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
