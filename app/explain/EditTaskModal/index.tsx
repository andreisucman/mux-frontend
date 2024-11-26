import React, { useState } from "react";
import { Button, Loader, Stack, Text } from "@mantine/core";
import { formatDate } from "@/helpers/formatDate";
import EditExistingTask from "../EditExistingTask";
import classes from "./EditTaskModal.module.css";

export type UpdateTaskProps = {
  taskId: string;
  description: string;
  instruction: string;
  date: Date | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

type Props = {
  taskId: string;
  startsAt: string;
  description: string;
  instruction: string;
  updateTask: (props: UpdateTaskProps) => void;
};

export default function EditTaskModal({
  taskId,
  startsAt,
  description,
  instruction,
  updateTask,
}: Props) {
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedInstruction, setUpdatedInstruciton] = useState(instruction);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [step, setStep] = useState(1);

  const starsKeyDate = formatDate({ date: startsAt });
  const nowKeyDate = formatDate({ date: date || new Date() });

  const isDirty =
    updatedDescription !== description ||
    updatedInstruction !== instruction ||
    starsKeyDate !== nowKeyDate;

  return (
    <Stack className={classes.container}>
      {error && (
        <Text size="sm" className={classes.error}>
          {error}
        </Text>
      )}
      {isLoading && <Loader type="bars" size={48} className={classes.loader} />}
      {!isLoading && (
        <>
          {step === 1 && (
            <>
              <EditExistingTask
                date={date}
                setDate={setDate}
                updatedDescription={updatedDescription}
                updatedInstruction={updatedInstruction}
                setUpdatedDescription={setUpdatedDescription}
                setUpdatedInstruction={setUpdatedInstruciton}
              />
              <Button
                size="md"
                onClick={() =>
                  updateTask({
                    taskId,
                    description: updatedDescription,
                    instruction: updatedInstruction,
                    date,
                    isLoading,
                    setIsLoading,
                    setError,
                    setStep,
                  })
                }
                disabled={!isDirty}
              >
                🛠️ Update task
              </Button>
            </>
          )}
          {step === 2 && (
            <EditExistingTask
              readOnly={true}
              date={date}
              setDate={setDate}
              updatedDescription={updatedDescription}
              updatedInstruction={updatedInstruction}
              setUpdatedDescription={setUpdatedDescription}
              setUpdatedInstruction={setUpdatedInstruciton}
            />
          )}
        </>
      )}
    </Stack>
  );
}
