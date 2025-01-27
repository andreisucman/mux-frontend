import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import { RoutineType, TaskType } from "@/types/global";
import callTheServer from "./callTheServer";

export type CloneTaskProps = {
  taskId: string;
  startingDate: Date | null;
  returnTask?: boolean;
  returnRoutinesWithStatus?: string;
  setTaskInfo?: React.Dispatch<React.SetStateAction<TaskType | null>>;
  setRoutines?: React.Dispatch<React.SetStateAction<RoutineType[] | undefined>>;
};

export default async function cloneTask({
  taskId,
  startingDate,
  returnTask,
  returnRoutinesWithStatus,
  setTaskInfo,
  setRoutines,
}: CloneTaskProps) {
  const response = await callTheServer({
    endpoint: "cloneTask",
    method: "POST",
    body: { taskId, startingDate, returnTask, returnRoutinesWithStatus },
  });

  if (response.status === 200) {
    const { message, error } = response;

    if (error) {
      openErrorModal({ description: error });
      return;
    }

    const { routines, newTask } = message;

    if (routines && setRoutines) {
      setRoutines(routines);
    }

    if (newTask && setTaskInfo) {
      setTaskInfo(newTask);
    }

    modals.closeAll();
  }
}
