"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Loader, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import RoutineModerationCard from "./RoutineModerationCard";
import classes from "./manage-routines.module.css";

export const runtime = "edge";

export type RoutineDataType = {
  part: string;
  name: string;
  status: string;
  description: string;
  oneTimePrice: number;
  subscriptionPrice: number;
};

export default function ManageRoutines() {
  const { userDetails } = useContext(UserContext);
  const { routines } = userDetails || {};
  const [routineData, setRoutineData] = useState<RoutineDataType[]>();

  const saveRoutineData = useCallback(
    async (
      updatedRoutine: RoutineDataType,
      setError: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
    ) => {
      const { name, description, oneTimePrice, subscriptionPrice } = updatedRoutine;

      if (!name.trim().length) {
        setError({ name: "Name can't be empty." });
        return;
      }

      if (!description.trim().length) {
        setError({ description: "Description can't be empty." });
        return;
      }

      if (!oneTimePrice || oneTimePrice < 1) {
        setError({ oneTimePrice: "Set a one-time price." });
        return;
      }

      if (!subscriptionPrice || subscriptionPrice < 1) {
        setError({ subscriptionPrice: "Set a subscription price." });
        return;
      }

      const response = await callTheServer({
        endpoint: "saveRoutineData",
        method: "POST",
        body: updatedRoutine,
      });

      if (response.status === 200) {
        if (routineData && routineData.length) {
          const newRoutineData = routineData.map((obj) =>
            obj.part === updatedRoutine.part ? updatedRoutine : obj
          );
          setRoutineData(newRoutineData);
        } else {
          setRoutineData([updatedRoutine]);
        }
      }
    },
    [routineData]
  );

  const content = useMemo(() => {
    if (!routineData || !routines) return <Loader m="0 auto" mt="20%" />;
    return routines
      .sort((a, b) => a.part.localeCompare(b.part))
      .map((r, i) => {
        const relevantRoutineData = routineData.find((doItem) => doItem.part === r.part);
        const { name, status, description, oneTimePrice, subscriptionPrice } =
          relevantRoutineData || {};

        return (
          <RoutineModerationCard
            key={i}
            part={r.part}
            defaultName={name}
            defaultStatus={status}
            defaultDescription={description}
            defaultOneTimePrice={oneTimePrice}
            defaultSubscriptionPrice={subscriptionPrice}
            saveRoutineData={saveRoutineData}
          />
        );
      });
  }, [routines, routineData, saveRoutineData]);

  useEffect(() => {
    callTheServer({ endpoint: "getRoutineData", method: "GET" }).then((res) => {
      if (res.status === 200) {
        setRoutineData(res.message);
      }
    });
  }, []);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader title="Manage routines" />
      <SkeletonWrapper>
        <Stack flex={1}>{content}</Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
