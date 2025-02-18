import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import { RoutineType, TaskType } from "@/types/global";
import callTheServer from "./callTheServer";

export type CloneTaskProps = {
  taskId: string;
  startingDate: Date | null;
  returnTask?: boolean;
  setTaskInfo?: React.Dispatch<React.SetStateAction<TaskType | null>>;
  setRoutines?: React.Dispatch<React.SetStateAction<RoutineType[] | undefined>>;
};

export default async function cloneTask({
  taskId,
  startingDate,
  returnTask,
  setTaskInfo,
  setRoutines,
}: CloneTaskProps) {
  const response = await callTheServer({
    endpoint: "cloneTask",
    method: "POST",
    body: { taskId, startingDate, returnTask },
  });

  if (response.status === 200) {
    const { message, error } = response;

    if (error) {
      openErrorModal({ description: error });
      return;
    }

    const { routine, newTask } = message;

    if (routine && setRoutines) {
      setRoutines((prev: RoutineType[] | undefined) => {
        if (!prev) return prev;
        return prev.map((r) => (String(r._id) === String(routine._id) ? routine : r));
      });
    }

    if (newTask && setTaskInfo) {
      setTaskInfo(newTask);
    }

    modals.closeAll();

    if (newTask) return newTask._id;
  }
}
