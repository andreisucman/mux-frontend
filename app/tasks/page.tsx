"use client";

import React from "react";
import { Stack } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { TaskType } from "@/types/global";
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
  return (
    <Stack flex={1} className="smallPage">
      <SkeletonWrapper>
        <PageHeader titles={titles} />
        <TasksList />
      </SkeletonWrapper>
    </Stack>
  );
}
