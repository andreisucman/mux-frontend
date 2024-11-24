"use client";

import React, { useCallback, useContext, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Group, Stack, Title } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import modifyQuery from "@/helpers/modifyQuery";
import { UserDataType } from "@/types/global";
import { ConsiderationsInput } from "./ConsiderationsInput";
import RoutineList from "./RoutineList";
import { typeIconsMap } from "./typeIconsMap";
import classes from "./routine.module.css";

export const runtime = "edge";

const filterData = [
  { label: "Head", icon: typeIconsMap.head, value: "head" },
  { label: "Body", icon: typeIconsMap.body, value: "body" },
  { label: "Health", icon: typeIconsMap.health, value: "health" },
];

export default function MyRoutines() {
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { specialConsiderations } = userDetails || {};
  const type = searchParams.get("type") || "head";

  const updateSpecialConsiderations = useCallback(
    async (value: string, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
      if (!value.trim()) return;

      setIsLoading(true);

      try {
        const response = await callTheServer({
          endpoint: "updateSpecialConsiderations",
          method: "POST",
          body: { text: value },
        });
        if (response.status === 200) {
          setUserDetails(
            (prev: UserDataType) =>
              ({ ...prev, specialConsiderations: value || "" }) as UserDataType
          );
        }
      } catch (err) {
        console.log("Error in updateSpecialConsiderations: ", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  //   async function updateClub() {
  //     if (!value.trim()) return;
  //     if (value.trim().length > maxLength) return;

  //     const key = isName ? "name" : isIntro ? "intro" : "";

  //     setIsLoading(true);
  //     try {
  //       const { club } = userDetails || {};
  //       const newClub = { ...club, [key]: value };

  //       const response = await callTheServer({
  //         endpoint: "updateClubBio",
  //         method: "POST",
  //         body: { name: newClub.name, intro: newClub?.bio?.intro },
  //       });

  //       if (response.status === 200) {
  //         setUserDetails(
  //           (prev: UserDataType) =>
  //             ({
  //               ...prev,
  //               club: newClub,
  //             }) as UserDataType
  //         );
  //       }
  //     } catch (err) {
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  const { streaks } = userDetails || {};
  const { healthStreak, faceStreak, bodyStreak } = streaks || {};

  const streak =
    type === "health"
      ? healthStreak
      : type === "head"
        ? faceStreak
        : type === "body"
          ? bodyStreak
          : undefined;

  return (
    <Stack className={classes.container}>
      <Group className={classes.header}>
        <Title order={1}>My routines</Title>
        <FilterDropdown data={filterData} filterType="type" addToQuery />
      </Group>
      <ConsiderationsInput
        placeholder={"Special considerations"}
        defaultValue={specialConsiderations || ""}
        maxLength={300}
        saveValue={updateSpecialConsiderations}
      />
      <RoutineList
        icon={typeIconsMap[(type || "head") as "head"]}
        serie={streak}
        type={type as string}
      />
    </Stack>
  );
}
