import Link from "next/link";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import getReadableDateInterval from "@/helpers/getReadableDateInterval";
import openErrorModal from "@/helpers/openErrorModal";
import openInfoModal from "@/helpers/openInfoModal";
import { AllTaskType, RoutineType } from "@/types/global";
import callTheServer from "./callTheServer";

export type CopyTaskProps = {
  routineId: string;
  taskKey: string;
  startDate: Date | null;
  inform?: boolean;
  userName?: string;
  sort?: string | null;
  targetRoutineId?: string;
  ignoreIncompleteTasks?: boolean;
  setRoutines: React.Dispatch<React.SetStateAction<RoutineType[] | undefined>>;
};

const copyTask = async ({
  taskKey,
  routineId,
  startDate,
  inform,
  sort,
  userName,
  targetRoutineId,
  ignoreIncompleteTasks,
  setRoutines,
}: CopyTaskProps) => {
  if (!startDate) return;

  const body: { [key: string]: any } = {
    taskKey,
    routineId,
    targetRoutineId,
    ignoreIncompleteTasks,
    startDate,
    userName,
  };

  modals.closeAll();

  const response = await callTheServer({
    endpoint: "copyTask",
    method: "POST",
    body,
  });

  if (response.status === 200) {
    if (response.error) {
      openErrorModal({ description: response.error, onClose: () => modals.closeAll() });
      return;
    }

    if (inform) {
      const routine = response.message;
      const allTask = routine.allTasks.find((at: AllTaskType) => at.key === taskKey);
      const earliestTask = allTask.ids[0];
      const latestTask = allTask.ids[allTask.ids.length - 1];

      const dateRange = getReadableDateInterval(
        new Date(earliestTask.startsAt),
        new Date(latestTask.startsAt)
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
      const routine = response.message;

      setRoutines((prev) => {
        const updated = [...(prev || []), routine];
        if (sort === "startsAt") {
          updated.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
        } else {
          updated.sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
        }
        return updated;
      });
      modals.closeAll();
    }
  }
};

export default copyTask;
