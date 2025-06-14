import Link from "next/link";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import getReadableDateInterval from "@/helpers/getReadableDateInterval";
import openErrorModal from "@/helpers/openErrorModal";
import openInfoModal from "@/helpers/openInfoModal";
import { RoutineType, TaskType } from "@/types/global";
import callTheServer from "./callTheServer";

export type CopyTaskInstanceProps = {
  taskId: string;
  targetRoutineId?: string;
  resetNewTask?: boolean;
  startDate: Date | null;
  returnTask?: boolean;
  userName?: string;
  inform?: boolean;
  cb?: (newTaskId: string) => void;
  setTaskInfo?: React.Dispatch<React.SetStateAction<TaskType | undefined>>;
  setRoutines?: React.Dispatch<React.SetStateAction<RoutineType[] | undefined>>;
};

export default async function copyTaskInstance({
  taskId,
  inform,
  userName,
  targetRoutineId,
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
    body: { taskId, startDate, targetRoutineId, userName, returnTask, resetNewTask },
  });

  if (response.status === 200) {
    const { message, error } = response;

    if (error) {
      openErrorModal({ description: error });
      return;
    }

    const { routine, newTask } = message;

    if (inform) {
      const date = getReadableDateInterval(new Date(newTask.startsAt), new Date(newTask.startsAt));
      openInfoModal({
        title: "✔️ Success!",
        description: (
          <Text>
            Task copied and scheduled to {date}.{" "}
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
