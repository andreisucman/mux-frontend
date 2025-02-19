import { Checkbox, Combobox, Group, Input, Pill, PillsInput, useCombobox } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { partIcons } from "@/helpers/icons";

type Props = {
  data: string[];
  uploadedParts: string[];
  setParts: (parts: string[]) => void;
};

const defaultParts = ["face", "mouth", "scalp", "body"];

export default function InputWithCheckboxes({ data, uploadedParts, setParts }: Props) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const handleValueSelect = (val: string) => {
    if (uploadedParts.includes(val)) return;
    const newValue = data.includes(val) ? data.filter((v) => v !== val) : [...data, val];

    setParts(newValue);
  };

  const handleValueRemove = (val: string) => {
    if (uploadedParts.includes(val)) return;
    const newValue = data.filter((v) => v !== val);
    setParts(newValue);
  };

  const values = data.map((item) => {
    return (
      <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
        <span>{upperFirst(item)}</span>
      </Pill>
    );
  });

  const options = defaultParts.map((item) => (
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
        <span>{upperFirst(item)}</span>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
      <Combobox.DropdownTarget>
        <PillsInput pointer onClick={() => combobox.toggleDropdown()} flex={1}>
          <Pill.Group style={{ flexWrap: "nowrap" }}>
            {values.length > 0 ? values : <Input.Placeholder>Pick parts to scan</Input.Placeholder>}
            <Combobox.EventsTarget>
              <PillsInput.Field
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
      <Combobox.Dropdown miw={150}>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
