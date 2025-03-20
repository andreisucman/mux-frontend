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
  stealAll: boolean;
  userName?: string;
  router: AppRouterInstance;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const cloneRoutines = async ({
  routineIds,
  startDate,
  stealAll,
  userName,
  router,
  setIsLoading,
}: StealRoutinesProps) => {
  setIsLoading(true);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const body: { [key: string]: any } = { routineIds, userName, startDate, timeZone };

  if (stealAll) {
    body.stealAll = stealAll;
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
          Routine added.{" "}
          <span
            onClick={() => {
              router.push("/routines");
              modals.closeAll();
            }}
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
