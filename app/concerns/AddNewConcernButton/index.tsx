import React, { useState } from "react";
import { IconDeviceFloppy, IconPlus, IconX } from "@tabler/icons-react";
import { ActionIcon, Group, Text, TextInput } from "@mantine/core";
import classes from "./AddNewConcernButton.module.css";

type Props = {
  isDisabled: boolean;
  handleAddNewConcern: (newConcernName: string) => void;
};

export default function AddNewContentButton({ isDisabled, handleAddNewConcern }: Props) {
  const [newConcernName, setNewConcernName] = useState("");
  const [showTextField, setShowTextField] = useState(false);

  return (
    <>
      {showTextField ? (
        <TextInput
          radius="md"
          placeholder="Type the concern name"
          rightSectionWidth={42}
          disabled={isDisabled}
          leftSection={<IconPlus size={16} stroke={1.5} />}
          onChange={(e) => setNewConcernName(e.currentTarget.value)}
          rightSection={
            <>
              {newConcernName ? (
                <ActionIcon
                  size="sm"
                  disabled={isDisabled}
                  variant={newConcernName.length > 0 ? "filled" : "default"}
                  onClick={() => handleAddNewConcern(newConcernName)}
                >
                  <IconDeviceFloppy size={12} />
                </ActionIcon>
              ) : (
                <ActionIcon disabled={isDisabled} variant={"default"} size="sm" onClick={() => setShowTextField(false)}>
                  <IconX size={12} />
                </ActionIcon>
              )}
            </>
          }
        />
      ) : (
        <Group
          className={classes.addConcernRow}
          onClick={isDisabled ? undefined : () => setShowTextField(true)}
        >
          <ActionIcon variant="default" size="sm">
            <IconPlus size={12} />
          </ActionIcon>
          <Text size={"sm"}>Add new concern</Text>
        </Group>
      )}
    </>
  );
}
