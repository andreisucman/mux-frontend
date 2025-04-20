import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import { RoutineType } from "@/types/global";
import callTheServer from "./callTheServer";

export type RescheduleRoutineProps = {
  routineId: string;
  startDate: Date | null;
  isReschedule?: boolean;
  sort?: string | null;
  setRoutines: React.Dispatch<React.SetStateAction<RoutineType[] | undefined>>;
};

const rescheduleRoutine = async ({
  sort,
  routineId,
  startDate,
  setRoutines,
}: RescheduleRoutineProps) => {
  if (!startDate) return;

  const body: { [key: string]: any } = { routineId, startDate, sort };

  const response = await callTheServer({
    endpoint: "rescheduleRoutine",
    method: "POST",
    body,
  });

  if (response.status === 200) {
    if (response.error) {
      openErrorModal({ description: response.error, onClose: () => modals.closeAll() });
      return;
    }

    setRoutines((prev) => {
      const filtered = prev?.filter(Boolean) || [];
      return filtered?.map((obj) =>
        routineId === obj._id ? response.message.find((r: RoutineType) => r._id === obj._id) : obj
      );
    });

    modals.closeAll();
  }
};

export default rescheduleRoutine;
