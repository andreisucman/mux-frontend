import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import { deduplicateRoutines } from "@/helpers/utils";
import { RoutineType } from "@/types/global";
import callTheServer from "./callTheServer";

export type CloneRoutinesProps = {
  currentRoutineId: string;
  targetRoutineId?: string;
  taskKey: string;
  startDate: Date | null;
  sort?: string | null;
  setRoutines: React.Dispatch<React.SetStateAction<RoutineType[] | undefined>>;
};

const rescheduleTask = async ({
  taskKey,
  currentRoutineId,
  targetRoutineId,
  startDate,
  sort,
  setRoutines,
}: CloneRoutinesProps) => {
  if (!startDate) return;

  const body: { [key: string]: any } = {
    taskKey,
    currentRoutineId,
    targetRoutineId,
    startDate,
  };

  const response = await callTheServer({
    endpoint: "rescheduleTask",
    method: "POST",
    body,
  });

  if (response.status === 200) {
    if (response.error) {
      openErrorModal({ description: response.error, onClose: () => modals.closeAll() });
      return;
    }

    const routines: RoutineType[] = response.message;

    setRoutines((prev) => deduplicateRoutines(prev || [], routines, sort || ""));
  }

  modals.closeAll();
};

export default rescheduleTask;
