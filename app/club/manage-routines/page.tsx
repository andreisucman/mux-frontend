"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Loader, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import PageHeader from "@/components/PageHeader";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import { RoutineType } from "@/types/global";
import RoutineModerationCard from "./RoutineModerationCard";
import classes from "./manage-routines.module.css";

export const runtime = "edge";

export type RoutineDataType = {
  part: string;
  name: string;
  status: string;
  description: string;
  price: number;
  updatePrice: number;
};

export default function ManageRoutines() {
  const [routines, setRoutines] = useState<RoutineType[]>();
  const [routineData, setRoutineData] = useState<RoutineDataType[]>();

  const saveRoutineData = useCallback(
    async (
      updatedRoutine: RoutineDataType,
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
      setError: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
    ) => {
      setIsLoading(true);
      const { name, description, price, updatePrice } = updatedRoutine;

      if (!name.trim().length) {
        setError({ name: "Name can't be empty." });
        return;
      }

      if (!description.trim().length) {
        setError({ description: "Description can't be empty." });
        return;
      }

      if (!price || price < 1) {
        setError({ price: "Set a one-time price." });
        return;
      }

      if (!updatePrice || updatePrice < 1) {
        setError({ updatePrice: "Set a subscription price." });
        return;
      }

      console.log("updatedRoutine",updatedRoutine)

      const response = await callTheServer({
        endpoint: "saveRoutineData",
        method: "POST",
        body: updatedRoutine,
      });

      if (response.status === 200) {
        if (response.error) {
          openErrorModal({ description: response.error });
          setIsLoading(false);
          return;
        }

        if (routineData?.length === 0) {
          setRoutineData([updatedRoutine]);
        } else {
          const partData = routineData?.find((r) => r.part === updatedRoutine.part);
          console.log("partData", partData);

          if (partData) {
            setRoutineData((prev) =>
              prev?.map((r) => (r.part === updatedRoutine.part ? updatedRoutine : r))
            );
          } else {
            setRoutineData((prev) => [...(prev || []), updatedRoutine]);
          }
        }
      }
      setIsLoading(false);
    },
    [routineData]
  );

  const content = useMemo(() => {
    if (!routineData || !routines) return <Loader m="0 auto" mt="20%" />;
    return routines
      .sort((a, b) => a.part.localeCompare(b.part))
      .map((r, i) => {
        const relevantRoutineData = routineData.find((doItem) => doItem.part === r.part);
        const { name, status, description, price, updatePrice } = relevantRoutineData || {};

        return (
          <RoutineModerationCard
            key={i}
            part={r.part}
            defaultName={name}
            defaultStatus={status}
            defaultDescription={description}
            defaultOneTimePrice={price}
            defaultUpdatePrice={updatePrice}
            saveRoutineData={saveRoutineData}
          />
        );
      });
  }, [routines, routineData, saveRoutineData]);

  useEffect(() => {
    callTheServer({ endpoint: "getRoutineData", method: "GET" }).then((res) => {
      if (res.status === 200) {
        const { routines, routineData } = res.message;
        setRoutines(routines);
        setRoutineData(routineData);
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
