import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import { RoutineType } from "@/types/global";
import callTheServer from "./callTheServer";

export type CloneRoutinesProps = {
  routineId: string;
  taskKey: string;
  startDate: Date | null;
  sort?: string | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setRoutines: React.Dispatch<React.SetStateAction<RoutineType[] | undefined>>;
};

const rescheduleTask = async ({
  taskKey,
  routineId,
  startDate,
  sort,
  setIsLoading,
  setRoutines,
}: CloneRoutinesProps) => {
  if (!startDate) return;

  const body: { [key: string]: any } = {
    taskKey,
    routineId,
    startDate,
  };

  setIsLoading(true);

  const response = await callTheServer({
    endpoint: "rescheduleTask",
    method: "POST",
    body,
  });

  if (response.status === 200) {
    if (response.error) {
      openErrorModal({ description: response.error, onClose: () => modals.closeAll() });
      setIsLoading(false);
      return;
    }

    const routines: RoutineType[] = response.message;

    setRoutines((prev) => {
      const routineIds = new Set(routines.map((r) => r._id));

      let updated = (prev || []).filter((r) => routineIds.has(r._id));

      routines.forEach((routine) => {
        const index = updated.findIndex((r) => r._id === routine._id);
        if (index !== -1) {
          updated[index] = routine;
        } else {
          updated.push(routine);
        }
      });

      updated.sort((a, b) =>
        sort === "startsAt"
          ? new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
          : new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()
      );

      return updated;
    });
  }

  modals.closeAll();
  setIsLoading(false);
};

export default rescheduleTask;
