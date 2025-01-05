"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowRight } from "@tabler/icons-react";
import { Button, rem, Stack } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import InstructionContainer from "@/components/InstructionContainer";
import PageHeaderWithReturn from "@/components/PageHeaderWithReturn";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router";
import { SexEnum, UserDataType } from "@/types/global";
import SkeletonWrapper from "../SkeletonWrapper";
import ConcernsSortCard from "./ConcernsSortCard";
import { maintenanceConcerns } from "./maintenanceConcerns";
import classes from "./sort-concerns.module.css";

export const runtime = "edge";

export default function SortConcerns() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { height, ref } = useElementSize();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const type = searchParams.get("type");
  const part = searchParams.get("part");

  const { concerns, demographics } = userDetails || {};
  const { sex } = demographics || {};

  const selectedConcerns = useMemo(() => {
    if (!concerns) return null;

    let selectedConcerns = concerns.filter((obj) => obj.type === type);

    if (part) {
      selectedConcerns = selectedConcerns.filter((obj) => obj.part === part);
    }

    if (selectedConcerns.length === 0) {
      const selectedMaintenanceConcerns = maintenanceConcerns.filter((c) => c.part === part);
      selectedConcerns.push(...selectedMaintenanceConcerns);
    }

    return selectedConcerns;
  }, [concerns, type, part]);

  const activeConcerns = useMemo(
    () => selectedConcerns?.filter((obj) => !obj.isDisabled),
    [selectedConcerns?.length, type, part]
  );

  async function onButtonClick() {
    setIsLoading(true);
    router.push(`/considerations?${searchParams.toString()}`);
  }

  useEffect(() => {
    setUserDetails((prev: UserDataType) => ({
      ...prev,
      concerns: selectedConcerns,
    }));
  }, [type, typeof selectedConcerns]);

  return (
    <Stack className={`${classes.container} smallPage`} ref={ref}>
      <SkeletonWrapper show={!selectedConcerns}>
        <PageHeaderWithReturn title="Sort concerns" showReturn />
        <InstructionContainer
          sex={sex || SexEnum.FEMALE}
          title="Instructions"
          instruction={`These are the potential ${type ? type : ""} concerns identified from your photos.`}
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
        <ConcernsSortCard
          concerns={selectedConcerns || []}
          type={type as string}
          maxHeight={height}
        />
      </SkeletonWrapper>
    </Stack>
  );
}
