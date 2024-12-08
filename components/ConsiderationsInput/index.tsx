"use client";

import { useEffect, useState } from "react";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { ActionIcon, Text, TextInput } from "@mantine/core";
import classes from "./ConsiderationsInput.module.css";

type Props = {
  defaultValue: string;
  placeholder: string;
  maxLength: number;
  saveValue: (value: string, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => void;
};

export function ConsiderationsInput({
  defaultValue = "",
  placeholder = "",
  maxLength,
  saveValue,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");

  const isDirty = defaultValue.trim() !== value.trim();
  const charactersLeft = maxLength - value.trim().length;

  useEffect(() => {
    if (!defaultValue) return;
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      w={"100%"}
      onChange={(event) => {
        if (event.target.value.length > maxLength) return;
        setValue(event.target.value);
      }}
      rightSection={
        <ActionIcon
          disabled={!isDirty}
          loading={isLoading}
          onClick={() => {
            if (value.trim().length > maxLength) return;
            saveValue(value, setIsLoading);
          }}
        >
          <IconDeviceFloppy className="icon" />
        </ActionIcon>
      }
      leftSection={
        <Text size="sm" c="dimmed" className={classes.text}>
          {charactersLeft}
        </Text>
      }
      leftSectionWidth={50}
    />
  );
}
