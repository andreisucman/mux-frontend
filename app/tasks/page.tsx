"use client";

import React, { useContext } from "react";
import { Stack, Title } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import ChatWithModal from "../../components/ChatWithModal";
import { ConsiderationsInput } from "../../components/ConsiderationsInput";
import { ChatCategoryEnum } from "../diary/type";
import SkeletonWrapper from "../SkeletonWrapper";
import TasksList from "./TasksList";

const titles = [
  { label: "Closest tasks", value: "/tasks", method: "push" },
  { label: "Task history", value: "/tasks/history", method: "push" },
];

export const runtime = "edge";

export default function Tasks() {
  const { userDetails } = useContext(UserContext);
  const { specialConsiderations } = userDetails || {};

  return (
    <Stack flex={1} className="smallPage">
      <SkeletonWrapper>
        <PageHeader titles={titles} hidePartDropdown />
        <ConsiderationsInput
          placeholder={"Special considerations"}
          defaultValue={specialConsiderations || ""}
          maxLength={300}
        />
        <TasksList />
        <ChatWithModal
          defaultVisibility="open"
          chatCategory={ChatCategoryEnum.TASK}
          openChatKey={ChatCategoryEnum.TASK}
          dividerLabel={"Discuss tasks"}
          starterQuestions={[
            "which task should i start first",
            "in what order should i complete my tasks to optimize for time",
          ]}
          modalTitle={
            <Title order={5} component={"p"}>
              Discuss tasks
            </Title>
          }
        />
      </SkeletonWrapper>
    </Stack>
  );
}
