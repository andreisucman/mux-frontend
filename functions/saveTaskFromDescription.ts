import { modals } from "@mantine/modals";
import { RawTaskType } from "@/app/tasks/TasksList/CreateTaskOverlay/AddATaskContainer/types";
import callTheServer from "./callTheServer";

export type HandleSaveTaskProps = {
  concern: string | null;
  part: string | null;
  isLoading: boolean;
  frequency: number;
  date: Date | null;
  exampleVideoId?: string;
  rawTask?: RawTaskType;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAnalysisGoing: React.Dispatch<React.SetStateAction<boolean>>;
};

const saveTaskFromDescription = async ({
  date,
  concern,
  part,
  rawTask,
  isLoading,
  frequency,
  exampleVideoId,
  setError,
  setIsLoading,
  setIsAnalysisGoing,
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
      frequency,
      description,
      instruction,
      exampleVideoId,
      startDate: date,
    },
  });

  if (response.status === 200) {
    if (response.error) {
      setError(response.error);
      setIsLoading(false);
      return;
    }

    setIsAnalysisGoing(true);
    modals.closeAll();
  } else {
    setIsLoading(false);
  }
};

export default saveTaskFromDescription;
