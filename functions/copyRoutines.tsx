import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import Link from "@/helpers/custom-router/patch-router/link";
import getReadableDateInterval from "@/helpers/getReadableDateInterval";
import openErrorModal from "@/helpers/openErrorModal";
import openInfoModal from "@/helpers/openInfoModal";
import { RoutineType } from "@/types/global";
import callTheServer from "./callTheServer";

export type CopyRoutinesProps = {
  routineIds: string[];
  startDate: Date | null;
  inform?: boolean;
  userName?: string;
  sort?: string | null;
  ignoreIncompleteTasks?: boolean;
  setRoutines: React.Dispatch<React.SetStateAction<RoutineType[] | undefined>>;
  setSelectedConcerns: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
};

const copyRoutines = async ({
  routineIds,
  startDate,
  inform,
  sort,
  userName,
  ignoreIncompleteTasks,
  setRoutines,
  setSelectedConcerns,
}: CopyRoutinesProps) => {
  if (!startDate) return;

  const body: { [key: string]: any } = {
    routineIds,
    startDate,
    sort,
    userName,
    ignoreIncompleteTasks,
  };

  modals.closeAll();

  const response = await callTheServer({
    endpoint: "copyRoutines",
    method: "POST",
    body,
  });

  if (response.status === 200) {
    if (response.error) {
      openErrorModal({ description: response.error, onClose: () => modals.closeAll() });
      return;
    }

    if (inform) {
      const data = response.message;
      const dateRange = getReadableDateInterval(
        new Date(data[0].startsAt),
        new Date(data[data.length - 1].lastDate)
      );
      openInfoModal({
        title: "✔️ Success!",
        description: (
          <Text>
            Routine copied and scheduled to {dateRange}.{" "}
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
      const newRoutineConcerns = response.message.reduce(
        (a: { [key: string]: string[] }, c: RoutineType) => {
          a[c._id] = [...new Set(c.allTasks.map((t) => t.concern))];
          return a;
        },
        {}
      );

      setSelectedConcerns((prev) => ({ ...prev, ...newRoutineConcerns }));
      setRoutines((prev) => {
        const updated = [...(prev || []), ...response.message];
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

export default copyRoutines;
