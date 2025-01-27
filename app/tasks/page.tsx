"use client";

import React, { useCallback, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { Stack, Title } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { UserDataType } from "@/types/global";
import ChatWithModal from "../../components/ChatWithModal";
import { ConsiderationsInput } from "../../components/ConsiderationsInput";
import { ChatCategoryEnum } from "../diary/type";
import SkeletonWrapper from "../SkeletonWrapper";
import TasksList from "./TasksList";

export const runtime = "edge";

export default function Tasks() {
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
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <Stack flex={1} className="smallPage">
      <SkeletonWrapper>
        <PageHeader title="Current's tasks" hidePartDropdown />
        <ConsiderationsInput
          placeholder={"Special considerations"}
          defaultValue={specialConsiderations || ""}
          saveValue={updateSpecialConsiderations}
          maxLength={300}
        />
        <TasksList type={type as string} />
        <ChatWithModal
          defaultVisibility="open"
          chatCategory={ChatCategoryEnum.TASK}
          openChatKey={ChatCategoryEnum.TASK}
          dividerLabel={"Discuss tasks"}
          starterQuestions={[
            "which task should i start first",
            "which of my tasks require going to gym",
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
