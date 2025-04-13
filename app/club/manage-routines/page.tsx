"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import { Button, rem, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import callTheServer from "@/functions/callTheServer";
import Link from "@/helpers/custom-router/patch-router/link";
import openErrorModal from "@/helpers/openErrorModal";
import { normalizeString } from "@/helpers/utils";
import RoutineModerationCard from "./RoutineModerationCard";
import classes from "./manage-routines.module.css";

export const runtime = "edge";

export type RoutineDataType = {
  concern: string;
  name: string;
  status: string;
  description: string;
  price: number;
  updatePrice: number;
};

export default function ManageRoutines() {
  const [routineConcerns, setRoutineConcerns] = useState<FilterItemType[]>([]);
  const [routineData, setRoutineData] = useState<RoutineDataType[]>();
  const [selectedRoutineData, setSelectedRoutineData] = useState<RoutineDataType>();

  const searchParams = useSearchParams();
  const concern = searchParams.get("concern") || routineConcerns[0]?.value;

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
          const partData = routineData?.find((r) => r.concern === updatedRoutine.concern);
          if (partData) {
            setRoutineData((prev) =>
              prev?.map((r) => (r.concern === updatedRoutine.concern ? updatedRoutine : r))
            );
          } else {
            setRoutineData((prev) => [...(prev || []), updatedRoutine]);
          }

          setSelectedRoutineData(updatedRoutine);
        }
      }
      setIsLoading(false);
    },
    [routineData]
  );

  const handleSelectRoutine = (concern?: string | null) => {
    if (!routineData || !concern) return;
    const relevantRoutineData = routineData.find((doItem) => doItem.concern === concern);
    setSelectedRoutineData(relevantRoutineData);
  };

  useEffect(() => {
    callTheServer({ endpoint: "getRoutineData", method: "GET" }).then((res) => {
      if (res.status === 200) {
        const { concerns, routineData } = res.message;

        const concernsItems = concerns.map((c: string) => ({
          value: c,
          label: normalizeString(c),
        }));
        setRoutineConcerns(concernsItems);
        setRoutineData(routineData);
        setSelectedRoutineData(routineData[0]);
      }
    });
  }, []);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader
        title="Manage routines"
        children={
          <FilterDropdown
            data={routineConcerns}
            selectedValue={concern}
            filterType="concern"
            placeholder="Select concern"
            onSelect={handleSelectRoutine}
            addToQuery
            searchable
          />
        }
      />
      <SkeletonWrapper show={!routineData}>
        <Stack flex={1}>
          {routineConcerns.length > 0 ? (
            <RoutineModerationCard
              concern={concern}
              defaultName={selectedRoutineData?.name}
              defaultStatus={selectedRoutineData?.status}
              defaultDescription={selectedRoutineData?.description}
              defaultOneTimePrice={selectedRoutineData?.price}
              defaultUpdatePrice={selectedRoutineData?.updatePrice}
              saveRoutineData={saveRoutineData}
            />
          ) : (
            <OverlayWithText
              icon={<IconCircleOff size={24} />}
              text="You don't have any routines"
              button={
                <Button variant="default" mt={rem(8)} c="gray.2" component={Link} href="/routines">
                  Add a routine
                </Button>
              }
            />
          )}
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
