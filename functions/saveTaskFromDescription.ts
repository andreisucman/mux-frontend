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
      if (response.error === "short") {
        setError("Make your description and instruction at least 50 characters long.");
      } else if (response.error === "long") {
        setError("Make your description and instruction less than 200 characters long.");
      } else if (response.error === "scan") {
        setError(`You need to scan your ${part} first.`);
      } else if (response.error === "inappropriate") {
        setError("Your text seems to contain inappropriate language. Please try again.");
      } else if (response.error === "violates") {
        setError(
          "This task violates our ToS. Please modify your description or instruction and try again."
        );
      } else {
        setError(response.error);
      }

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
