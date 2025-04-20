"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router";
import { daysFrom } from "@/helpers/utils";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);

  const [todaysTasksGroups, setTodaysTasksGroups] = useState<TaskWithOnClickType[][]>();
  const [tomorrowsTasksGroups, setTomorrowsTasksGroups] = useState<TaskWithOnClickType[][]>();
  const [canAddDiary, setCanAddDiary] = useState<boolean>();

  const { specialConsiderations } = userDetails || {};

  const getTaskClickHandler = useCallback(
    (taskId: string) => () => {
      const paramsString = searchParams.toString();
      router.push(`/explain/${taskId}${paramsString ? `?${paramsString}` : ""}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    const { tasks } = userDetails || {};
    if (tasks && tasks.length > 0) {
      const todayStart = tasks[0].startsAt;
      const tomorrowStart = daysFrom({ date: new Date(tasks[0].startsAt), days: 1 });

      const todayEnd = new Date(todayStart);
      todayEnd.setHours(23, 59, 59, 0);

      const tomorrowEnd = daysFrom({ date: new Date(tomorrowStart), days: 1 });
      tomorrowEnd.setHours(23, 59, 59, 0);

      const todaysTasksWithOnClick = tasks
        .filter((t) => new Date(t.startsAt) < todayEnd)
        .map((fTask) => ({
          ...fTask,
          onClick: getTaskClickHandler(fTask._id),
        }));

      const tomorrowsTasksWithOnClick = tasks
        .filter((t) => new Date(t.startsAt) >= tomorrowStart && new Date(t.startsAt) < tomorrowEnd)
        .map((fTask) => ({
          ...fTask,
          onClick: getTaskClickHandler(fTask._id),
        }));

      const todaysConcerns = [...new Set(todaysTasksWithOnClick.map((t) => t.concern))];
      const tomorrowsConcerns = [...new Set(tomorrowsTasksWithOnClick.map((t) => t.concern))];

      const todaysTasks = todaysConcerns
        .map((concern) => todaysTasksWithOnClick.filter((t) => t.concern === concern))
        .filter((gr) => gr.length);

      const tomorrowsTasks = tomorrowsConcerns
        .map((concern) => tomorrowsTasksWithOnClick.filter((t) => t.concern === concern))
        .filter((gr) => gr.length);

      const todayTasksCompleted =
        todaysTasksWithOnClick?.filter((task) => task.status === "completed").map((r) => r.part) ||
        [];

      const canAddDiary = tasks && tasks.length > 0 && todayTasksCompleted.length > 1;

      setTodaysTasksGroups(todaysTasks);
      setTomorrowsTasksGroups(tomorrowsTasks);
      setCanAddDiary(canAddDiary);
    } else {
      setTodaysTasksGroups([]);
      setTomorrowsTasksGroups([]);
      setCanAddDiary(false);
    }
  }, [userDetails?.tasks]);

  return (
    <Stack flex={1} className="smallPage">
      <SkeletonWrapper>
        <PageHeader titles={titles} />
        <ConsiderationsInput
          placeholder={"Special considerations"}
          defaultValue={specialConsiderations || ""}
          maxLength={300}
        />
        <TasksList
          todaysTasksGroups={todaysTasksGroups}
          tomorrowsTasksGroups={tomorrowsTasksGroups}
          canAddDiary={!!canAddDiary}
        />
      </SkeletonWrapper>
    </Stack>
  );
}
