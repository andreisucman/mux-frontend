import React from "react";
import { IconSquareRoundedCheck } from "@tabler/icons-react";
import { Group, rem, Stack, Text } from "@mantine/core";
import TextareaComponent from "@/components/TextAreaComponent";
import classes from "./EditExistingTask.module.css";

type Props = {
  readOnly?: boolean;
  updatedDescription: string;
  updatedInstruction: string;
  setUpdatedDescription: React.Dispatch<React.SetStateAction<string>>;
  setUpdatedInstruction: React.Dispatch<React.SetStateAction<string>>;
};

export default function EditExistingTask({
  readOnly,
  updatedDescription,
  updatedInstruction,
  setUpdatedDescription,
  setUpdatedInstruction,
}: Props) {
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  return (
    <Stack flex={1}>
      {readOnly && (
        <Group className={classes.banner}>
          <IconSquareRoundedCheck className="icon" style={{ marginRight: rem(6) }} /> Task updated
        </Group>
      )}
      <TextareaComponent
        text={updatedDescription}
        setText={setUpdatedDescription}
        readOnly={readOnly}
        heading={
          <Text size="xs" c="dimmed">
            Description:
          </Text>
        }
        placeholder="Updated description of the task"
      />
      <TextareaComponent
        text={updatedInstruction}
        setText={setUpdatedInstruction}
        readOnly={readOnly}
        heading={
          <Text size="xs" c="dimmed">
            Instruction:
          </Text>
        }
        placeholder="Updated instruction of the task"
      />
    </Stack>
  );
}
