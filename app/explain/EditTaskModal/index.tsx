import React, { useState } from "react";
import { Button, Loader, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import askConfirmation from "@/helpers/askConfirmation";
import { HandleUpdateTaskinstanceProps } from "../[taskId]/page";
import EditExistingTask from "../EditExistingTask";
import classes from "./EditTaskModal.module.css";

type Props = {
  taskId: string;
  taskDate: string;
  description: string;
  instruction: string;
  updateTask: (props: HandleUpdateTaskinstanceProps) => Promise<void>;
};

export default function EditTaskModal({
  taskId,
  description,
  taskDate,
  instruction,
  updateTask,
}: Props) {
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedInstruction, setUpdatedInstruciton] = useState(instruction);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | null>(new Date());

  const isDirty =
    updatedDescription !== description ||
    updatedInstruction !== instruction ||
    date?.toDateString() !== new Date(taskDate).toDateString();

  const handleUpdateTask = async (applyToAll?: boolean) => {
    const isDateUpdated = date?.toDateString() !== new Date(taskDate).toDateString();

    const payload: HandleUpdateTaskinstanceProps = {
      taskId,
      description: updatedDescription,
      instruction: updatedInstruction,
      isLoading,
      setIsLoading,
      setStep,
    };

    if (applyToAll) payload.applyToAll = true;
    if (isDateUpdated) {
      payload.isReschedule = true;
      payload.date = date;
    }

    updateTask(payload);
    modals.closeAll();
  };

  const saveEdits = () => {
    const descriptionUpdated = updatedDescription !== description;
    const instructionUpdated = updatedInstruction !== instruction;

    if (descriptionUpdated || instructionUpdated) {
      const parts = [];

      if (descriptionUpdated) parts.push("description");
      if (instructionUpdated) parts.push("instruction");

      const text = `Do you want to update the ${parts.join(", and")} of the other tasks of the same type?`;
      askConfirmation({
        title: "Update other tasks?",
        body: text,
        onConfirm: () => handleUpdateTask(true),
        onCancel: () => handleUpdateTask(),
      });
    } else {
      handleUpdateTask();
    }
  };

  return (
    <Stack className={classes.container}>
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
              <Button onClick={saveEdits} disabled={!isDirty}>
                Update task
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
