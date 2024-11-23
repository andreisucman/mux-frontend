import cn from "classnames";
import { Checkbox, rem, Text, UnstyledButton } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { ImageCheckboxProps } from "./types";
import classes from "./StyleGoalModalRow.module.css";

export default function StyleGoalModalRow({
  name,
  icon,
  checked,
  defaultChecked,
  description,
  className,
  onChange,
  ...others
}: ImageCheckboxProps & Omit<React.ComponentPropsWithoutRef<"button">, keyof ImageCheckboxProps>) {
  return (
    <UnstyledButton
      {...others}
      onClick={() => onChange({ icon, name, description })}
      data-checked={checked}
      className={cn(classes.button, { [classes.selected]: checked })}
    >
      <Text className={classes.icon}>{icon}</Text>
      <div className={classes.body}>
        <Text c="dimmed" size="xs">
          {upperFirst(name)}
        </Text>
        <Text>{description}</Text>
      </div>

      <Checkbox
        ml={rem(8)}
        readOnly
        checked={checked}
        tabIndex={-1}
        styles={{ input: { cursor: "pointer" } }}
      />
    </UnstyledButton>
  );
}
