import { modals } from "@mantine/modals";
import { RawTaskType } from "@/app/tasks/TasksList/CreateTaskOverlay/AddATaskContainer/types";
import callTheServer from "./callTheServer";

export type HandleSaveTaskProps = {
  concern: string | null;
  returnTasks?: boolean;
  returnRoutine?: boolean;
  part: string | null;
  isLoading: boolean;
  frequency: number;
  date: Date | null;
  exampleVideoId?: string;
  rawTask?: RawTaskType;
  selectedDestinationRoutine: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  cb: (args: any) => void;
};

const saveTaskFromDescription = async ({
  date,
  concern,
  part,
  returnTasks,
  returnRoutine,
  rawTask,
  isLoading,
  frequency,
  exampleVideoId,
  selectedDestinationRoutine,
  setError,
  setIsLoading,
  cb,
}: HandleSaveTaskProps) => {
  if (isLoading) return;
  if (!rawTask) return;

  setIsLoading(true);
  setError("");

  const { description, instruction } = rawTask;

  const response = await callTheServer({
    endpoint: "saveTaskFromDescription",
    method: "POST",
    body: {
      concern,
      part,
      returnTasks,
      returnRoutine,
      frequency,
      description,
      instruction,
      exampleVideoId,
      selectedDestinationRoutine,
      startDate: date,
    },
  });

  if (response.status === 200) {
    if (response.error) {
      setError(response.error);
      setIsLoading(false);
      return;
    }

    cb(response.message);
    modals.closeAll();
  } else {
    setIsLoading(false);
  }
};

export default saveTaskFromDescription;
