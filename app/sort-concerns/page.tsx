"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import InstructionContainer from "@/components/InstructionContainer";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router";
import { UserConcernType, UserDataType } from "@/types/global";
import SkeletonWrapper from "../SkeletonWrapper";
import ConcernsSortCard from "./ConcernsSortCard";
import classes from "./sort-concerns.module.css";

export const runtime = "edge";

export default function SortConcerns() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { height, ref } = useElementSize();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const part = searchParams.get("part");

  const { concerns, nextRoutine } = userDetails || {};

  const selectedConcerns: UserConcernType[] | null = useMemo(() => {
    if (!concerns) return null;
    if (!nextRoutine) return null;

    const routineCreatedParts = nextRoutine
      .filter((obj) => obj.date !== null && new Date(obj.date) > new Date())
      .map((obj) => obj.part);

    let remaining = concerns.filter((obj) => !routineCreatedParts.includes(obj.part));

    if (part) {
      remaining = remaining.filter((obj) => obj.part === part);
    }

    return remaining;
  }, [userDetails, part]);

  const activeConcerns = useMemo(
    () => selectedConcerns?.filter((obj) => !obj.isDisabled),
    [selectedConcerns]
  );

  async function onButtonClick() {
    setIsLoading(true);
    const stringParams = searchParams.toString();
    router.push(`/considerations${stringParams ? `?${stringParams}` : ""}`);
  }

  useEffect(() => {
    console.log("selectedConcerns", selectedConcerns);
    setUserDetails((prev: UserDataType) => ({
      ...prev,
      concerns: selectedConcerns,
    }));
  }, [selectedConcerns && selectedConcerns.length]);

  console.log("userDetails", userDetails?.concerns);

  return (
    <Stack className={`${classes.container} smallPage`} ref={ref}>
      <SkeletonWrapper show={!selectedConcerns}>
        <PageHeader title="Sort concerns" showReturn />
        <InstructionContainer
          title="Instructions"
          instruction={`These are the potential concerns identified from your photos.`}
          description="Drag and drop to change their importance or click the minus sign to ignore."
          customStyles={{ flex: 0 }}
        />
        <Button
          loading={isLoading}
          onClick={onButtonClick}
          disabled={
            isLoading || !selectedConcerns || (activeConcerns && activeConcerns.length === 0)
          }
        >
          Next
        </Button>
        <ConcernsSortCard concerns={selectedConcerns || []} maxHeight={height} />
      </SkeletonWrapper>
    </Stack>
  );
}
