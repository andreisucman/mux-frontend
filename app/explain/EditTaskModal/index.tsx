import React, { useState } from "react";
import { Button, Loader, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import askConfirmation from "@/helpers/askConfirmation";
import { HandleUpdateTaskinstanceProps } from "../[taskId]/page";
import EditExistingTask from "../EditExistingTask";
import classes from "./EditTaskModal.module.css";

type Props = {
  taskId: string;
  description: string;
  instruction: string;
  updateTask: (props: HandleUpdateTaskinstanceProps) => Promise<void>;
};

export default function EditTaskModal({ taskId, description, instruction, updateTask }: Props) {
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedInstruction, setUpdatedInstruciton] = useState(instruction);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const isDirty = updatedDescription !== description || updatedInstruction !== instruction;

  const handleUpdateTask = async (applyToAll?: boolean) => {
    try {
      const payload: HandleUpdateTaskinstanceProps = {
        taskId,
        description: updatedDescription,
        instruction: updatedInstruction,
        isLoading,
        setIsLoading,
        setStep,
      };

      if (applyToAll) payload.applyToAll = true;

      updateTask(payload);
      modals.closeAll();
    } catch (err) {}
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
