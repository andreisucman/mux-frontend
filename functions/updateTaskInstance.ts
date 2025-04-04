import openErrorModal from "@/helpers/openErrorModal";
import { RoutineType } from "@/types/global";
import callTheServer from "./callTheServer";

export type UpdateTaskInstanceProps = {
  taskId: string;
  description?: string;
  instruction?: string;
  date?: Date | null;
  applyToAll?: boolean;
  isLoading?: boolean;
  returnRoutine?: boolean;
  cb?: (routine: RoutineType) => void;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

const updateTaskInstance = async ({
  date,
  taskId,
  description,
  instruction,
  isLoading,
  applyToAll,
  cb,
  returnRoutine,
  setIsLoading,
}: UpdateTaskInstanceProps) => {
  if (isLoading) return;

  if (setIsLoading) setIsLoading(true);

  const response = await callTheServer({
    endpoint: "editTaskInstance",
    method: "POST",
    body: {
      taskId,
      startDate: date,
      updatedDescription: description,
      updatedInstruction: instruction,
      applyToAll,
      returnRoutine,
    },
  });

  if (response.status === 200) {
    if (response.error) {
      if (setIsLoading) setIsLoading(false);
      openErrorModal({ description: response.error });
      return;
    }

    if (cb) cb(response.message);

    return true;
  }
  if (setIsLoading) setIsLoading(false);
};

export default updateTaskInstance;
