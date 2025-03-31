import React from "react";
import { Group, rem, Stack, Text, TextInput } from "@mantine/core";

type Props = {
  prefix: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  title: string;
  customStyles?: { [key: string]: any };
};

export default function ToCompleteInput({
  prefix,
  title,
  value,
  setValue,
  customStyles,
  placeholder,
}: Props) {
  return (
    <Stack gap={0} style={customStyles || {}}>
      <Text size="xs" c="dimmed" component="span">
        {title}
      </Text>
      <Group gap={0} wrap="nowrap">
        <Text c="dimmed" size="sm">
          {prefix}
        </Text>{" "}
        <TextInput
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          placeholder={placeholder}
        />
      </Group>
    </Stack>
  );
}
