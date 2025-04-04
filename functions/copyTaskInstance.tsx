import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import Link from "@/helpers/custom-router/patch-router/link";
import getReadableDateInterval from "@/helpers/getReadableDateInterval";
import openErrorModal from "@/helpers/openErrorModal";
import openInfoModal from "@/helpers/openInfoModal";
import { RoutineType, TaskType } from "@/types/global";
import callTheServer from "./callTheServer";

export type CopyTaskInstanceProps = {
  taskId: string;
  resetNewTask?: boolean;
  startDate: Date | null;
  returnTask?: boolean;
  userName?: string;
  inform?: boolean;
  cb?: (newTaskId: string) => void;
  setTaskInfo?: React.Dispatch<React.SetStateAction<TaskType | null>>;
  setRoutines?: React.Dispatch<React.SetStateAction<RoutineType[] | undefined>>;
};

export default async function copyTaskInstance({
  taskId,
  inform,
  userName,
  resetNewTask,
  startDate,
  returnTask,
  setTaskInfo,
  setRoutines,
  cb,
}: CopyTaskInstanceProps) {
  const response = await callTheServer({
    endpoint: "copyTaskInstance",
    method: "POST",
    body: { taskId, startDate, userName, returnTask, resetNewTask },
  });

  if (response.status === 200) {
    const { message, error } = response;

    if (error) {
      openErrorModal({ description: error });
      return;
    }

    const { routine, newTask } = message;

    if (inform) {
      const dateRange = getReadableDateInterval(
        new Date(routine.startsAt),
        new Date(routine.lastDate)
      );
      openInfoModal({
        title: "✔️ Success!",
        description: (
          <Text>
            Task copied and scheduled to {dateRange}.{" "}
            <Link
              href="/routines"
              onClick={() => {
                modals.closeAll();
              }}
              style={{ cursor: "pointer" }}
            >
              Click to view.
            </Link>
          </Text>
        ),
      });
    } else {
      if (routine && setRoutines) {
        setRoutines((prev: RoutineType[] | undefined) => {
          return (prev || []).map((r) => (String(r._id) === String(routine._id) ? routine : r));
        });
      }

      if (newTask && setTaskInfo) {
        setTaskInfo(newTask);
      }

      modals.closeAll();

      if (newTask) return newTask._id;
    }

    if (cb && newTask) cb(newTask._id);
  }
}
