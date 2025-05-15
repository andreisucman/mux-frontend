"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import cn from "classnames";
import { Button, Group, rem, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import { normalizeString } from "@/helpers/utils";
import RoutineModerationCard from "./RoutineModerationCard";
import classes from "./manage-routines.module.css";

export const runtime = "edge";

export type RoutineDataType = {
  concern: string;
  part: string;
  name: string;
  status: string;
  description: string;
  stats?: {
    routines: number;
    completedTasks: number;
    completedTasksWithProof: number;
    diaryRecords: number;
  };
};

export default function ManageRoutines() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [routineConcerns, setRoutineConcerns] = useState<FilterItemType[]>([]);
  const [routineParts, setRoutineParts] = useState<FilterItemType[]>([]);
  const [routineData, setRoutineData] = useState<RoutineDataType[]>();
  const [defaultRoutineData, setDefaultRoutineData] = useState<RoutineDataType>({
    concern: "",
    part: "",
    description: "",
    name: "",
    status: "hidden",
  });

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("hidden");
  const [pageLoaded, setPageLoaded] = useState(false);

  const concern = searchParams.get("concern") || routineConcerns[0]?.value;
  const part = searchParams.get("part") || routineParts[0]?.value;

  const saveRoutineData = useCallback(
    async (
      updatedRoutine: RoutineDataType,
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
      setError: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
    ) => {
      setIsLoading(true);
      const { name, description } = updatedRoutine;

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

        if (!routineData) {
          setRoutineData([updatedRoutine]);
        } else {
          const relevantRoutine = routineData?.find(
            (r) => r.concern === updatedRoutine.concern && r.part === updatedRoutine.part
          );
          if (relevantRoutine) {
            setRoutineData((prev) =>
              prev?.map((r) =>
                r.concern === updatedRoutine.concern && r.part === updatedRoutine.part
                  ? updatedRoutine
                  : r
              )
            );
          } else {
            setRoutineData((prev) => [...(prev || []), updatedRoutine]);
          }

          setFields(updatedRoutine);
          setDefaultRoutineData(updatedRoutine);
        }
      }
      setIsLoading(false);
    },
    [routineData]
  );

  const setFields = (data?: RoutineDataType) => {
    const { name, description, status } = data || {};
    setName(name || "");
    setDescription(description || "");
    setStatus(status || "hidden");
  };

  const handleSelectConcern = (
    fieldName: "concern" | "part",
    routineData: RoutineDataType[],
    value?: string | null
  ) => {
    if (!routineData || !value) return;
    const relevantRoutineData = routineData.find((doItem) => doItem[fieldName] === value);
    if (relevantRoutineData) {
      setFields(relevantRoutineData);
    } else {
      setFields(defaultRoutineData);
      setDefaultRoutineData(defaultRoutineData);
    }
  };

  const fetchRoutineData = async () => {
    try {
      const response = await callTheServer({ endpoint: "getRoutineData", method: "GET" });

      if (response.status === 200) {
        const { concerns, parts, routineData } = response.message;

        const concernsItems = concerns.map((c: string) => ({
          value: c,
          label: normalizeString(c),
        }));

        const partItems = parts.map((c: string) => ({
          value: c,
          label: normalizeString(c),
        }));

        setRoutineParts(partItems);
        setRoutineConcerns(concernsItems);
        setRoutineData(routineData);

        let data = routineData[0];

        const relevantRoutineData = routineData.find(
          (doItem: RoutineDataType) => doItem.concern === concern && doItem.part === part
        );

        if (relevantRoutineData) {
          data = relevantRoutineData;
        } else {
          data = defaultRoutineData;
        }

        if (data) {
          setFields(data);
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (!pageLoaded) return;
    fetchRoutineData();
  }, [pageLoaded]);

  useEffect(() => setPageLoaded(true), []);

  return (
    <Stack className={cn(classes.container, "smallPage")}>
      <PageHeader
        title="Manage routines"
        children={
          <Group>
            <FilterDropdown
              data={routineConcerns}
              selectedValue={concern}
              filterType="concern"
              placeholder="Select concern"
              onSelect={(value) => handleSelectConcern("concern", routineData || [], value)}
              isDisabled={routineConcerns.length === 0}
              customStyles={{ flexBasis: "60%" }}
              addToQuery
            />
            <FilterDropdown
              data={routineParts}
              selectedValue={part}
              filterType="part"
              placeholder="Select part"
              onSelect={(value) => handleSelectConcern("part", routineData || [], value)}
              isDisabled={routineParts.length === 0}
              addToQuery
            />
          </Group>
        }
      />
      <SkeletonWrapper show={!routineData}>
        <Stack flex={1}>
          {routineConcerns.length > 0 ? (
            <RoutineModerationCard
              name={name}
              part={part}
              description={description}
              status={status}
              concern={concern}
              defaultRoutineData={defaultRoutineData}
              setName={setName}
              setDescription={setDescription}
              setStatus={setStatus}
              saveRoutineData={saveRoutineData}
            />
          ) : (
            <OverlayWithText
              icon={<IconCircleOff size={24} />}
              text="You don't have any routines"
              button={
                <Button variant="default" onClick={() => router.push("/routines")} mt={rem(8)}>
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
