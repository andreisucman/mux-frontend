"use client";

import { useContext, useEffect, useState } from "react";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { ActionIcon, Text, TextInput } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import updateSpecialConsiderations from "@/functions/updateSpecialConsiderations";
import classes from "./ConsiderationsInput.module.css";

type Props = {
  defaultValue: string;
  placeholder: string;
  maxLength: number;
};

export function ConsiderationsInput({ defaultValue = "", placeholder = "", maxLength }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const { setUserDetails } = useContext(UserContext);

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
            updateSpecialConsiderations({ value, setIsLoading, setUserDetails });
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
