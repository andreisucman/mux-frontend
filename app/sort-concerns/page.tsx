"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowRight, IconMan, IconMoodSmile } from "@tabler/icons-react";
import { Button, Group, Skeleton, Stack, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import FilterDropdown from "@/components/FilterDropdown";
import InstructionContainer from "@/components/InstructionContainer";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router";
import { SexEnum, UserDataType } from "@/types/global";
import SkeletonWrapper from "../SkeletonWrapper";
import ConcernsSortCard from "./ConcernsSortCard";
import { maintenanceConcerns } from "./maintenanceConcerns";
import classes from "./sort-concerns.module.css";

export const runtime = "edge";

const icons = {
  head: <IconMoodSmile className="icon" />,
  body: <IconMan className="icon" />,
};

const filterData = [
  { label: "Head", value: "head" },
  { label: "Body", value: "body" },
];

export default function SortConcerns() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { height, ref } = useElementSize();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const type = searchParams.get("type") || "head";
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
  }, [concerns?.length, type, part]);

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
      <SkeletonWrapper>
        <Group className={classes.heading}>
          <Title order={1}>Sort concerns</Title>
          <FilterDropdown
            data={filterData}
            icons={icons}
            placeholder="Select type"
            filterType="type"
            addToQuery
          />
        </Group>
        <InstructionContainer
          sex={sex || SexEnum.FEMALE}
          title="Instructions"
          instruction={"These are the potential concerns identified from your photos."}
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
          Next <IconArrowRight className="icon" />
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
