"use client";

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconAnalyze, IconRoute } from "@tabler/icons-react";
import cn from "classnames";
import useSWR from "swr";
import { Alert, Button, Divider, Group, Loader, rem, Stack, Text, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import SelectDateModalContent from "@/app/explain/[taskId]/SelectDateModalContent";
import GlowingButton from "@/components/GlowingButton";
import PageHeader from "@/components/PageHeader";
import { CreateRoutineSuggestionContext } from "@/context/CreateRoutineSuggestionContext";
import { RoutineSuggestionType } from "@/context/CreateRoutineSuggestionContext/types";
import { UserContext } from "@/context/UserContext";
import { AuthStateEnum } from "@/context/UserContext/types";
import callTheServer from "@/functions/callTheServer";
import fetchUserData from "@/functions/fetchUserData";
import { useRouter } from "@/helpers/custom-router";
import {
  deleteFromLocalStorage,
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/helpers/localStorage";
import openAuthModal from "@/helpers/openAuthModal";
import openErrorModal from "@/helpers/openErrorModal";
import useCheckActionAvailability from "@/helpers/useCheckActionAvailability";
import { PartEnum } from "@/types/global";
import ReviseRoutineModalContent from "./ReviseRoutineModalContent";
import SuggestedTaskRow from "./SuggestedTaskRow";
import classes from "./suggest-routine.module.css";

export const runtime = "edge";

export type CreateRoutineProps = {
  startDate: Date | null;
  part: PartEnum;
  taskCountMap?: { [key: string]: any };
  revisionText?: string;
};

export default function SuggestRoutine() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offsetRef = useRef(0);
  const sourceRef = useRef<EventSource | null>(null);
  const { routineSuggestion, setRoutineSuggestion, fetchRoutineSuggestion } = useContext(
    CreateRoutineSuggestionContext
  );
  const { status, userDetails, setUserDetails } = useContext(UserContext);
  const [thoughts, setThoughts] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);
  const [loaderText, setLoaderText] = useState("");
  const [displayComponent, setDisplayComponent] = useState<"loading" | "result">("loading");
  const [createRoutineLoading, setCreateRoutineLoading] = useState(false);
  const [taskCountMap, setTaskCountMap] = useState<{ [key: string]: any }>();

  const part = searchParams.get("part") || "face";
  const query = searchParams.toString();

  const {
    _id: routineSuggestionId,
    summary,
    reasoning,
    tasks,
    isRevised,
  } = routineSuggestion || {};

  console.log("routineSuggestion", routineSuggestion);

  const { _id: userId, nextRoutine, nextRoutineSuggestion } = userDetails || {};

  const { isActionAvailable: isSuggestionAvailable, checkBackDate: suggestionCheckBackDate } =
    useCheckActionAvailability({
      part,
      nextAction: nextRoutineSuggestion,
    });

  const { isActionAvailable: isCreationAvailable, checkBackDate: creationCheckBackDate } =
    useCheckActionAvailability({
      part,
      nextAction: nextRoutine,
    });

  const streamRoutineSuggestions = async (
    routineSuggestionId: string,
    revisionText?: string,
    userId?: string
  ) => {
    const API = process.env.NEXT_PUBLIC_API_SERVER_URL;
    const storedId = getFromLocalStorage("routineStreamId");
    const storedOffset = Number(getFromLocalStorage("routineStreamOffset") || 0);

    const endpoint = storedId
      ? `${API}/resumeRoutineSuggestionStream/${storedId}?offset=${storedOffset}`
      : `${API}/startRoutineSuggestionStream/${routineSuggestionId}`;

    const method = storedId ? "GET" : "POST";
    const headers = storedId ? {} : ({ "Content-Type": "application/json" } as any);

    try {
      const body: { [key: string]: any } = { userId };

      if (revisionText) {
        body.revisionText = revisionText;
        body.taskCountMap = taskCountMap;
      }

      const payload: { [key: string]: any } = { method, headers, credentials: "include" };

      if (!storedId) payload.body = JSON.stringify(body);

      const response = await fetch(endpoint, payload);

      if (revisionText) {
        modals.closeAll();
        setRoutineSuggestion((prev: RoutineSuggestionType) => {
          const { tasks, summary, reasoning, ...other } = prev;
          setThoughts("");
          return other;
        });
      }

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
        const idMatch = chunk.match(/id:\s*(\S+)/);
        if (idMatch && !id) {
          id = idMatch[1];
          saveToLocalStorage("routineStreamId", id);
        }

        const eventMatch = chunk.match(/event:\s*(\S+)/);
        if (eventMatch) {
          if (eventMatch[1] === "end") {
            setLoaderText("Finalizing...");
          }
        }

        if (!idMatch && !eventMatch) {
          offset += chunk.length;
          offsetRef.current += chunk.length;
          setThoughts((prev) => prev + chunk);
          saveToLocalStorage("routineStreamOffset", offset.toString());
        }
      }
      fetchUserData({ setUserDetails });
      fetchRoutineSuggestion(userId).then(() => {
        setIsStreaming(false);
        setLoaderText("");
        deleteFromLocalStorage("routineStreamId");
        deleteFromLocalStorage("routineStreamOffset");
      });
    } catch (err: any) {
      console.log("err", err);
    }
  };

  const taskRows = useMemo(() => {
    if (!tasks) return;
    const concerns = Object.keys(tasks);
    const taskGroups = concerns.map((concern) => tasks[concern]).filter((gr) => gr.length > 0);

    return taskGroups.map((group, index) => {
      const name = group?.[0]?.concern;
      const label = name.split("_").join(" ");
      return (
        <Stack key={index}>
          <Divider
            label={
              <Text c="dimmed" size="sm">
                {upperFirst(label)}
              </Text>
            }
          />
          {group.map((t, i) => (
            <SuggestedTaskRow
              key={i}
              color={t.color}
              name={t.task}
              numberOfTimesInAMonth={t.numberOfTimesInAMonth}
              icon={t.icon}
              setTaskCountMap={setTaskCountMap}
            />
          ))}
        </Stack>
      );
    });
  }, [tasks, setTaskCountMap]);

  const checkBackNotice = isSuggestionAvailable ? undefined : (
    <Text className={classes.alert}>
      The next {part} routine suggestion is after{" "}
      {new Date(suggestionCheckBackDate || new Date()).toDateString()}.{" "}
    </Text>
  );

  const createRoutine = async ({ startDate, taskCountMap, part }: CreateRoutineProps) => {
    if (createRoutineLoading || !startDate) return;
    setCreateRoutineLoading(true);

    const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/routines?${searchParams.toString()}`;

    const response = await callTheServer({
      endpoint: "createRoutine",
      method: "POST",
      body: {
        part,
        taskCountMap,
        routineStartDate: startDate,
      },
    });

    if (response.status === 200) {
      if (response.error) {
        openErrorModal(response.error);
        setCreateRoutineLoading(false);
        return;
      }
      modals.closeAll();
      router.replace(redirectUrl);
    } else {
      setCreateRoutineLoading(false);
    }
  };

  const handleOpenReviseRoutine = useCallback(() => {
    console.log("routineSuggestionId", routineSuggestionId);
    if (!routineSuggestionId) return;

    modals.openContextModal({
      title: (
        <Title order={5} component={"p"}>
          Revise routine
        </Title>
      ),
      size: "sm",
      classNames: { overlay: "overlay" },
      innerProps: (
        <ReviseRoutineModalContent
          routineSuggestionId={routineSuggestionId}
          streamRoutineSuggestions={streamRoutineSuggestions}
        />
      ),
      modal: "general",
      centered: true,
    });
  }, [routineSuggestionId, streamRoutineSuggestions]);

  const handleOpenSelectRoutineDate = useCallback(() => {
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

  const signUp = () =>
    openAuthModal({
      stateObject: {
        redirectPath: "/suggest/result",
        localUserId: userId,
        referrer: ReferrerEnum.SUGGESTION,
      },
      title: "Sign up",
    });

  useSWR(`${routineSuggestionId}-${status}-${userId}`, () => {
    if (!routineSuggestionId) return;
    if (status !== AuthStateEnum.AUTHENTICATED && !userId) return;
    streamRoutineSuggestions(routineSuggestionId, undefined, userId);
  });

  useEffect(() => {
    if (tasks) {
      setDisplayComponent("result");
      setIsStreaming(false);
    }

    if (!isStreaming && reasoning) {
      setThoughts(reasoning);
    }
  }, [tasks, isStreaming]);

  useEffect(() => {
    const tId = setTimeout(() => {
      if (!routineSuggestion) router.replace(`/suggest/select-concerns${query ? `?${query}` : ""}`);
      clearTimeout(tId);
    }, 5000);
    return () => {
      clearTimeout(tId);
      sourceRef.current?.close();
    };
  }, [routineSuggestion, query]);

  const ctaButtons = useMemo(() => {
    const isAuthenticated = status === AuthStateEnum.AUTHENTICATED;
    return (
      <Group className={cn(classes.buttonWrapper, { [classes.extraMargin]: isAuthenticated })}>
        {isAuthenticated ? (
          <>
            {!isCreationAvailable && (
              <Text size="sm" ta="center" c="dimmed">
                You can create this routine after {creationCheckBackDate}
              </Text>
            )}
            {!isRevised && (
              <Button
                className={classes.button}
                onClick={handleOpenReviseRoutine}
                disabled={isRevised}
                variant="default"
              >
                Revise
              </Button>
            )}
            <Button
              className={classes.button}
              onClick={handleOpenSelectRoutineDate}
              disabled={!isCreationAvailable}
            >
              Create routine
            </Button>
          </>
        ) : (
          <>
            <Text size="sm" c="dimmed" ta="center">
              Sign up to be able to publish your progress and earn from views.
            </Text>
            <GlowingButton
              text={"Sign up and earn"}
              containerStyles={{
                width: "100%",
                maxWidth: rem(350),
              }}
              elementId="analysis_create_routine_btn"
              onClick={signUp}
            />
          </>
        )}
      </Group>
    );
  }, [status, isCreationAvailable, isRevised, routineSuggestionId, creationCheckBackDate]);

  return (
    <Stack className={cn(classes.container, "smallPage")}>
      <PageHeader title={"Suggest routine"} />
      {displayComponent !== "loading" && (
        <>
          {checkBackNotice && <Alert p="0.5rem 1rem">{checkBackNotice}</Alert>}
          <Stack className={classes.reasoningWrapper}>
            {!isStreaming && (
              <Group align="center" gap={8}>
                <IconAnalyze size={18} />
                <Text fw={600}>Reasoning</Text>
              </Group>
            )}
            {isStreaming && (
              <Group align="center" gap={8}>
                <Loader size={18} type="bars" />
                <Text fw={600}>Thinking</Text>
              </Group>
            )}
            <Stack className={cn(classes.streamingContent, "scrollbar")}>
              {isStreaming && (
                <Group align="center" gap={8}>
                  <Loader size={16} />
                  {loaderText && (
                    <Text fz="sm" fw={600}>
                      {loaderText}
                    </Text>
                  )}
                </Group>
              )}
              <Text style={{ whiteSpace: "pre-wrap" }}>{thoughts}</Text>
            </Stack>
          </Stack>
          {summary && (
            <Stack className={classes.content} style={{ flexDirection: "column", height: "unset" }}>
              <Group align="center" gap={8}>
                <IconRoute size={18} />
                <Text fw={600}>Suggested routine for the week</Text>
              </Group>
              <Text>{summary}</Text>
              {taskRows}
              {ctaButtons}
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
