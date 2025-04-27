"use client";

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconAnalyze, IconRoute } from "@tabler/icons-react";
import { Alert, Button, Divider, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import SelectDateModalContent from "@/app/explain/[taskId]/SelectDateModalContent";
import PageHeader from "@/components/PageHeader";
import { CreateRoutineContext } from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import fetchUserData from "@/functions/fetchUserData";
import openResetTimerModal from "@/functions/resetTimer";
import {
  deleteFromLocalStorage,
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import useCheckActionAvailability from "@/helpers/useCheckActionAvailability";
import { PartEnum } from "@/types/global";
import SuggestedTaskRow from "./SuggestedTaskRow";
import classes from "./suggest-routine.module.css";

export const runtime = "edge";

type CreateRoutineProps = {
  startDate: Date | null;
  part: PartEnum;
};

export default function SuggestRoutine() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const offsetRef = useRef(0);
  const sourceRef = useRef<EventSource | null>(null);
  const { routineSuggestion, fetchRoutineSuggestion } = useContext(CreateRoutineContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [thoughts, setThoughts] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);
  const [displayComponent, setDisplayComponent] = useState<"loading" | "result">("loading");
  const [createRoutineLoading, setCreateRoutineLoading] = useState(false);

  const part = searchParams.get("part") || "face";

  const { _id: routineSuggestionId, summary, tasks, reasoning } = routineSuggestion || {};
  const { nextRoutine } = userDetails || {};

  const { isScanAvailable, checkBackDate } = useCheckActionAvailability({
    part,
    nextAction: nextRoutine,
  });

  const streamRoutineSuggestions = async (routineSuggestionId: string) => {
    const API = process.env.NEXT_PUBLIC_API_SERVER_URL;
    const storedId = getFromLocalStorage("routineStreamId");
    const storedOffset = Number(getFromLocalStorage("routineStreamOffset") || 0);

    const endpoint = storedId
      ? `${API}/resumeRoutineSuggestionStream/${storedId}?offset=${storedOffset}`
      : `${API}/startRoutineSuggestionStream/${routineSuggestionId}`;
    const method = storedId ? "GET" : "POST";
    const headers = storedId ? {} : ({ "Content-Type": "application/json" } as any);

    try {
      const response = await fetch(endpoint, { method, headers, credentials: "include" });

      setIsStreaming(true);
      setDisplayComponent("result");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let id = storedId;
      let offset = storedOffset;

      while (reader) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const idMatch = chunk.match(/id: (.+)/);
        if (idMatch && !id) {
          id = idMatch[1];
          saveToLocalStorage("routineStreamId", id);
        }

        const dataMatches = chunk.match(/data: (.+)/g);
        if (dataMatches) {
          const cleaned = dataMatches.map((d) => d.replace("data: ", "")).join("");
          offset += cleaned.length;
          offsetRef.current += cleaned.length;
          setThoughts((prev) => prev + cleaned);
          console.log("chunk", chunk);
          console.log("cleaned length", cleaned.length);
          saveToLocalStorage("routineStreamOffset", offset.toString());
        }
      }

      fetchUserData({ setUserDetails });
      fetchRoutineSuggestion();
    } catch (err) {
      console.error(err);
    } finally {
      setIsStreaming(false);
      deleteFromLocalStorage("routineStreamId");
      deleteFromLocalStorage("routineStreamOffset");
    }
  };

  const taskRows = useMemo(() => {
    if (!tasks) return;
    const concerns = Object.keys(tasks);
    const taskGroups = concerns.map((concern) => tasks[concern]);

    return taskGroups.map((group, index) => {
      const name = group?.[0]?.concern;
      const label = name.split("_").join(" ");
      return (
        <Stack key={index}>
          {taskGroups.length > 1 && (
            <Divider
              label={
                <Text c="dimmed" size="sm">
                  {upperFirst(label)}
                </Text>
              }
            />
          )}
          {group.map((t, i) => (
            <SuggestedTaskRow
              key={i}
              color={t.color}
              name={t.task}
              numberOfTimesInAMonth={t.numberOfTimesInAMonth}
              icon={t.icon}
            />
          ))}
        </Stack>
      );
    });
  }, [tasks]);

  const query = searchParams.toString();
  const handleResetTimer = useCallback(() => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}${query ? `?${query}` : ""}`;
    openResetTimerModal("suggestion", part, redirectUrl, setUserDetails);
  }, [query, part, setUserDetails]);

  const checkBackNotice = isScanAvailable ? undefined : (
    <Text className={classes.alert}>
      Next routine suggestion is after {new Date(checkBackDate || new Date()).toDateString()}.{" "}
      <span onClick={handleResetTimer}>Reset</span>
    </Text>
  );

  const createRoutine = async ({ startDate, part }: CreateRoutineProps) => {
    if (createRoutineLoading || !startDate) return;
    setCreateRoutineLoading(true);

    const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/routines?${searchParams.toString()}`;

    const response = await callTheServer({
      endpoint: "createRoutine",
      method: "POST",
      body: {
        part,
        routineStartDate: startDate,
      },
    });

    if (response.status === 200) {
      if (response.error) {
        openErrorModal(response.error);
        setCreateRoutineLoading(false);
        return;
      }
      router.replace(redirectUrl);
    } else {
      setCreateRoutineLoading(false);
    }
  };

  const handleCloneTaskInstance = useCallback(() => {
    modals.openContextModal({
      title: (
        <Title order={5} component={"p"}>
          Choose starting date
        </Title>
      ),
      size: "sm",
      classNames: { overlay: "overlay" },
      innerProps: (
        <SelectDateModalContent
          buttonText="Create routine"
          onSubmit={async ({ startDate }) =>
            createRoutine({
              startDate,
              part: part as PartEnum,
            })
          }
        />
      ),
      modal: "general",
      centered: true,
    });
  }, [part]);

  useEffect(() => {
    if (!routineSuggestionId || !isScanAvailable) return;
    streamRoutineSuggestions(routineSuggestionId);

    return () => {
      sourceRef.current?.close();
    };
  }, [routineSuggestionId, isScanAvailable]);

  useEffect(() => {
    if (tasks) setDisplayComponent("result");
    if (reasoning) {
      setThoughts(reasoning);
      setIsStreaming(false);
    }
  }, [tasks, reasoning]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader title={"Result"} />
      {displayComponent !== "loading" && (
        <>
          {checkBackNotice && <Alert p="0.5rem 1rem">{checkBackNotice}</Alert>}
          <Stack className={classes.content}>
            <Group align="center" gap={8}>
              {isStreaming ? (
                <>
                  <Loader size={18} type="bars" />
                  <Text fw={600}>Reasoning</Text>
                </>
              ) : (
                <>
                  <IconAnalyze size={18} />
                  <Text fw={600}>Reasoning</Text>
                </>
              )}
            </Group>
            <Text>{thoughts}</Text>
            {isStreaming && <Loader size={16} m="0 auto" />}
          </Stack>
          {summary && (
            <Stack className={classes.summaryContainer}>
              <Stack className={classes.content}>
                <Group align="center" gap={8}>
                  <IconRoute size={18} />
                  <Text fw={600}>Suggested routine for the week</Text>
                </Group>
                <Text>{summary}</Text>
              </Stack>
              {taskRows}
              <Button
                onClick={handleCloneTaskInstance}
                disabled={!isScanAvailable}
                className={classes.button}
              >
                Create routine
              </Button>
            </Stack>
          )}
        </>
      )}
      {displayComponent === "loading" && (
        <Loader
          m="0 auto"
          mt="30%"
          color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
        />
      )}
    </Stack>
  );
}
