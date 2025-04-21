"use client";

import React, { useContext } from "react";
import { Stack } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import { TaskType } from "@/types/global";
import { ConsiderationsInput } from "../../components/ConsiderationsInput";
import SkeletonWrapper from "../SkeletonWrapper";
import TasksList from "./TasksList";

const titles = [
  { label: "Closest tasks", value: "/tasks", method: "push" },
  { label: "Task history", value: "/tasks/history", method: "push" },
];

export const runtime = "edge";

export interface TaskWithOnClickType extends TaskType {
  onClick: () => void;
}

export default function Tasks() {
  const { userDetails } = useContext(UserContext);
  const { specialConsiderations } = userDetails || {};

  return (
    <Stack flex={1} className="smallPage">
      <SkeletonWrapper>
        <PageHeader titles={titles} />
        <ConsiderationsInput
          placeholder={"Special considerations"}
          defaultValue={specialConsiderations || ""}
          maxLength={300}
        />
        <TasksList />
      </SkeletonWrapper>
    </Stack>
  );
}
