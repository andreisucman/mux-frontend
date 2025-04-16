import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import { deduplicateRoutines } from "@/helpers/utils";
import { RoutineType } from "@/types/global";
import callTheServer from "./callTheServer";

export type CloneRoutinesProps = {
  taskId: string;
  startDate: Date | null;
  selectedRoutineId?: string;
  sort?: string | null;
  setRoutines: React.Dispatch<React.SetStateAction<RoutineType[] | undefined>>;
};

const rescheduleTaskInstance = async ({
  taskId,
  startDate,
  sort,
  selectedRoutineId,
  setRoutines,
}: CloneRoutinesProps) => {
  if (!startDate) return;

  const body: { [key: string]: any } = {
    taskId,
    startDate,
    selectedRoutineId,
  };

  const response = await callTheServer({
    endpoint: "rescheduleTaskInstance",
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

export default rescheduleTaskInstance;
