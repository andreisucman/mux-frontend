import {
  Checkbox,
  Combobox,
  Group,
  Input,
  Pill,
  PillsInput,
  Text,
  useCombobox,
} from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { partIcons } from "@/helpers/icons";
import classes from "./InputWithCheckboxes.module.css";

type Props = {
  data: string[];
  defaultData: string[];
  dataToIgnore?: string[];
  withPills?: boolean;
  placeholder: string;
  readOnly?: boolean;
  setData: (items: string[]) => void;
};

export default function InputWithCheckboxes({
  data,
  dataToIgnore,
  withPills,
  placeholder,
  defaultData,
  readOnly,
  setData,
}: Props) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const handleValueSelect = (val: string) => {
    if (dataToIgnore?.includes(val)) return;
    const newValue = data.includes(val) ? data.filter((v) => v !== val) : [...data, val];
    setData(newValue);
  };

  const handleValueRemove = (val: string) => {
    if (dataToIgnore?.includes(val)) return;
    const newValue = data.filter((v) => v !== val);
    setData(newValue);
  };

  const values = data.map((item) => {
    const label = item.split("_").join(" ");
    return (
      <Pill key={item} withRemoveButton={withPills} onRemove={() => handleValueRemove(item)}>
        <span>{upperFirst(label)}</span>
      </Pill>
    );
  });

  const options = defaultData.map((item) => {
    const label = upperFirst(item.split("_").join(" "));
    return (
      <Combobox.Option value={item} key={item} active={data.includes(item)}>
        <Group gap="sm">
          <Checkbox
            checked={data.includes(item)}
            onChange={() => {}}
            aria-hidden
            tabIndex={-1}
            style={{ pointerEvents: "none" }}
          />
          {partIcons[item.toLowerCase()]}
          <span>{label}</span>
        </Group>
      </Combobox.Option>
    );
  });

  return (
    <Combobox
      readOnly={readOnly}
      store={combobox}
      onOptionSubmit={handleValueSelect}
      withinPortal={false}
    >
      <Combobox.DropdownTarget>
        <PillsInput
          itemType={readOnly ? "button" : "text"}
          onClick={() => combobox.toggleDropdown()}
          flex={1}
          miw={150}
          pointer
        >
          <Pill.Group className={classes.pillGroup}>
            {withPills ? (
              <>
                {values.length > 0 ? values : <Input.Placeholder>{placeholder}</Input.Placeholder>}
              </>
            ) : (
              <Text className={classes.placeholderText}>{placeholder}</Text>
            )}
            <Combobox.EventsTarget>
              <PillsInput.Field
                readOnly={readOnly}
                type="hidden"
                onBlur={() => combobox.closeDropdown()}
                onKeyDown={(event) => {
                  if (event.key === "Backspace") {
                    event.preventDefault();
                    handleValueRemove(data[data.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>
      <Combobox.Dropdown className={classes.dropdown}>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
