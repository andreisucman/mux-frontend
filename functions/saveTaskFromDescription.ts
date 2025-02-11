import { modals } from "@mantine/modals";
import { RawTaskType } from "@/app/tasks/TasksList/CreateTaskOverlay/AddATaskContainer/types";
import { saveToLocalStorage } from "@/helpers/localStorage";
import callTheServer from "./callTheServer";

export type HandleSaveTaskProps = {
  concern: string | null;
  part: string | null;
  timeZone?: string;
  isLoading: boolean;
  frequency: number;
  date: Date | null;
  rawTask?: RawTaskType;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayComponent: React.Dispatch<
    React.SetStateAction<"loading" | "wait" | "scanOverlay" | "createTaskOverlay" | "content">
  >;
};

const saveTaskFromDescription = async ({
  date,
  concern,
  part,
  timeZone,
  rawTask,
  isLoading,
  frequency,
  setError,
  setIsLoading,
  setDisplayComponent,
}: HandleSaveTaskProps) => {
  if (isLoading) return;
  if (!rawTask) return;

  try {
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
        startDate: date,
        timeZone,
      },
    });

    if (response.status === 200) {
      if (response.error) {
        setError(response.error);
        setIsLoading(false);
        return;
      }

      saveToLocalStorage("runningAnalyses", { routine: true }, "add");
      setDisplayComponent("wait");
      modals.closeAll();
    }
  } catch (err) {
    setIsLoading(false);
  }
};

export default saveTaskFromDescription;
