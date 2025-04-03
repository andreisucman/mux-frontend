import React from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import openInfoModal from "@/helpers/openInfoModal";
import callTheServer from "./callTheServer";

type StealRoutinesProps = {
  routineIds: string[];
  startDate: Date | null;
  copyAll: boolean;
  userName?: string;
  router: AppRouterInstance;
  ignoreIncompleteTasks?: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const cloneRoutines = async ({
  routineIds,
  startDate,
  copyAll,
  userName,
  router,
  ignoreIncompleteTasks,
  setIsLoading,
}: StealRoutinesProps) => {
  setIsLoading(true);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const body: { [key: string]: any } = {
    routineIds,
    ignoreIncompleteTasks,
    userName,
    startDate,
    timeZone,
  };

  if (copyAll) {
    body.copyAll = copyAll;
  } else {
    body.routineIds = routineIds;
  }

  const response = await callTheServer({
    endpoint: "cloneRoutines",
    method: "POST",
    body,
  });

  if (response.status === 200) {
    if (response.error) {
      openErrorModal({ description: response.error });
      setIsLoading(false);
      return;
    }

    openInfoModal({
      title: "✔️ Success!",
      description: (
        <Text>
          Routine(s) added.{" "}
          <span
            onClick={() => {
              router.push("/routines");
              modals.closeAll();
            }}
            style={{ cursor: "pointer" }}
          >
            Click to view.
          </span>
        </Text>
      ),
    });
    setIsLoading(false);
  }
};

export default cloneRoutines;
