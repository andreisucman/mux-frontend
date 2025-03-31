"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Loader, rem, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import callTheServer from "@/functions/callTheServer";
import Link from "@/helpers/custom-router/patch-router/link";
import openErrorModal from "@/helpers/openErrorModal";
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
  const [routineParts, setRoutineParts] = useState<string[]>();
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
        setIsLoading(false);
        return;
      }

      if (!description.trim().length) {
        setError({ description: "Description can't be empty." });
        setIsLoading(false);
        return;
      }

      if (!price || price < 1) {
        setError({ price: "Set a one-time price." });
        setIsLoading(false);
        return;
      }

      if (!updatePrice || updatePrice < 1) {
        setError({ updatePrice: "Set a subscription price." });
        setIsLoading(false);
        return;
      }

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
    if (!routineData || !routineParts) return <Loader m="0 auto" mt="20%" />;
    if (routineParts.length === 0)
      return (
        <OverlayWithText
          text="You don't have any routines"
          button={
            <Button variant="default" mt={rem(8)} c="gray.2" component={Link} href="/routines">
              Add a routine
            </Button>
          }
        />
      );
    return routineParts
      .sort((a, b) => a.localeCompare(b))
      .map((part, i) => {
        const relevantRoutineData = routineData.find((doItem) => doItem.part === part);
        const { name, status, description, price, updatePrice } = relevantRoutineData || {};

        return (
          <RoutineModerationCard
            key={i}
            part={part}
            defaultName={name}
            defaultStatus={status}
            defaultDescription={description}
            defaultOneTimePrice={price}
            defaultUpdatePrice={updatePrice}
            saveRoutineData={saveRoutineData}
          />
        );
      });
  }, [routineParts, routineData, saveRoutineData]);

  useEffect(() => {
    callTheServer({ endpoint: "getRoutineData", method: "GET" }).then((res) => {
      if (res.status === 200) {
        const { parts, routineData } = res.message;
        setRoutineParts(parts);
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
