"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import cn from "classnames";
import { Button, rem, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import callTheServer from "@/functions/callTheServer";
import askConfirmation from "@/helpers/askConfirmation";
import openErrorModal from "@/helpers/openErrorModal";
import { normalizeString } from "@/helpers/utils";
import { PartEnum } from "@/types/global";
import RoutineDataList from "./RoutineDataList";
import classes from "./publish-routines.module.css";

export const runtime = "edge";

export type RoutineDataType = {
  concern: string;
  part: PartEnum;
  status: string;
  monetization?: "enabled" | "disabled";
};

export default function PublishRoutines() {
  const router = useRouter();
  const [routineData, setRoutineData] = useState<RoutineDataType[]>();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const changeStatus = useCallback(
    async (
      part: PartEnum,
      concern: string,
      newStatus: "public" | "hidden",
      oldStatus: "public" | "hidden",
      isLoading: boolean,
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      if (isLoading) return;

      setIsLoading(true);

      const save = async () => {
        const body: RoutineDataType = { part, concern, status: newStatus };
        if (newStatus === "hidden") body.monetization = "disabled";

        const response = await callTheServer({
          endpoint: "changeRoutineDataStatus",
          method: "POST",
          body,
        });

        if (response.status === 200) {
          if (response.error) {
            openErrorModal({ description: response.error });
            setIsLoading(false);
            return;
          }

          const relevantRoutine = routineData?.find(
            (r) => r.concern === concern && r.part === part
          );

          if (relevantRoutine) {
            setRoutineData((prev) =>
              prev?.map((r) => (r.concern === concern && r.part === part ? { ...r, ...body } : r))
            );
          } else {
            setRoutineData((prev) => [...(prev || []), { ...body, monetization: "disabled" }]);
          }
        }
      };

      let body = "";

      const isSwitchingToPublic = oldStatus !== "public" && newStatus === "public";
      const concernName = normalizeString(concern).toLowerCase();

      if (isSwitchingToPublic) {
        body = `This will make your ${concernName} related routines and their progress, diary, and proofs public. Continue?`;
      }

      if (isSwitchingToPublic) {
        askConfirmation({
          title: "Confirm action",
          body,
          onConfirm: () => save(),
        });
      } else {
        save();
      }

      setIsLoading(false);
    },
    [routineData]
  );

  const changeMonetization = useCallback(
    async (
      part: PartEnum,
      concern: string,
      newMonetization: "enabled" | "disabled",
      oldMonetization: "enabled" | "disabled",
      isLoading: boolean,
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      if (isLoading) return;
      setIsLoading(true);

      const save = async () => {
        const body = { part, concern, monetization: newMonetization };

        const response = await callTheServer({
          endpoint: "changeMonetizationStatus",
          method: "POST",
          body,
        });

        if (response.status === 200) {
          if (response.error) {
            openErrorModal({ description: response.error });
            setIsLoading(false);
            return;
          }

          const relevantRoutine = routineData?.find(
            (r) => r.concern === concern && r.part === part
          );

          if (relevantRoutine) {
            setRoutineData((prev) =>
              prev?.map((r) => (r.concern === concern && r.part === part ? { ...r, ...body } : r))
            );
          } else {
            setRoutineData((prev) => [...(prev || []), { ...body, status: "public" }]);
          }
        }
      };

      let body = "";

      const isTurningOff = oldMonetization !== "disabled" && newMonetization === "disabled";
      const concernName = normalizeString(concern).toLowerCase();

      if (isTurningOff) {
        body = `This will make you stop earning from the views on your ${concernName} routines. Continue?`;
      }

      if (isTurningOff) {
        askConfirmation({
          title: "Confirm action",
          body,
          onConfirm: () => save(),
        });
      } else {
        save();
      }

      setIsLoading(false);
    },
    [routineData]
  );

  const fetchRoutineData = async (
    hasMore: boolean,
    setHasMore: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      let endpoint = "getRoutineData";
      const searchParams = new URLSearchParams();

      if (hasMore && routineData) searchParams.set("skip", String(routineData.length));
      const query = searchParams.toString();

      if (query) endpoint += `?${query}`;

      const response = await callTheServer({ endpoint, method: "GET" });

      if (response.status === 200) {
        const data = response.message;

        setHasMore(data.length === 21);
        if (hasMore) {
          setRoutineData((prev) => [...(prev || []), ...data.slice(0, 20)]);
        } else {
          setRoutineData(data.slice(0, 20));
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (!pageLoaded) return;
    fetchRoutineData(false, setHasMore);
  }, [pageLoaded]);

  useEffect(() => setPageLoaded(true), []);

  return (
    <Stack className={cn(classes.container, "smallPage")}>
      <PageHeader title="Publish routines" />
      <SkeletonWrapper show={!routineData}>
        <Stack flex={1}>
          {routineData && routineData.length > 0 ? (
            <RoutineDataList
              hasMore={hasMore}
              fetchRoutineData={fetchRoutineData}
              setHasMore={setHasMore}
              changeStatus={changeStatus}
              changeMonetization={changeMonetization}
              routineDataRecords={routineData}
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
