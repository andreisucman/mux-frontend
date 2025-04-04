import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import { RoutineType } from "@/types/global";
import callTheServer from "./callTheServer";

export type CloneRoutinesProps = {
  taskId: string;
  startDate: Date | null;
  sort?: string | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setRoutines: React.Dispatch<React.SetStateAction<RoutineType[] | undefined>>;
  setSelectedConcerns: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
};

const rescheduleTaskInstance = async ({
  taskId,
  startDate,
  sort,
  setIsLoading,
  setRoutines,
  setSelectedConcerns,
}: CloneRoutinesProps) => {
  if (!startDate) return;

  const body: { [key: string]: any } = {
    taskId,
    startDate,
  };

  setIsLoading(true);

  const response = await callTheServer({
    endpoint: "rescheduleTaskInstance",
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

    const newRoutineConcerns = routines.reduce((a: { [key: string]: string[] }, c: RoutineType) => {
      a[c._id] = [...new Set(c.allTasks.map((t) => t.concern))];
      return a;
    }, {});

    setSelectedConcerns((prev) => ({ ...prev, ...newRoutineConcerns }));

    setRoutines((prev) => {
      const routineIds = new Set(routines.map((r) => r._id)); // Collect new routine IDs

      // Filter out routines that are not in the new list
      let updated = (prev || []).filter((r) => routineIds.has(r._id));

      // Update existing routines or add new ones
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

export default rescheduleTaskInstance;
