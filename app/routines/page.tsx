"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconArrowDown } from "@tabler/icons-react";
import { Accordion, ActionIcon, Loader, Stack, Title } from "@mantine/core";
import AccordionRoutineRow from "@/components/AccordionRoutineRow";
import UploadOverlay from "@/components/AnalysisCarousel/UploadOverlay";
import { ConsiderationsInput } from "@/components/ConsiderationsInput";
import PageHeaderWithReturn from "@/components/PageHeaderWithReturn";
import WaitComponent from "@/components/WaitComponent";
import { UserContext } from "@/context/UserContext";
import fetchRoutines from "@/functions/fetchRoutines";
import saveTaskFromDescription, { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { useRouter } from "@/helpers/custom-router";
import { deleteFromLocalStorage, getFromLocalStorage } from "@/helpers/localStorage";
import modifyQuery from "@/helpers/modifyQuery";
import { RoutineType } from "@/types/global";
import ChatWithModal from "../../components/ChatWithModal";
import { routineSegments } from "../club/[userName]/data";
import { ChatCategoryEnum } from "../diary/type";
import SkeletonWrapper from "../SkeletonWrapper";
import CreateTaskOverlay from "../tasks/TasksList/CreateTaskOverlay";
import TasksButtons from "../tasks/TasksList/TasksButtons";
import classes from "./routines.module.css";

export const runtime = "edge";

type GetRoutinesProps = {
  skip?: boolean;
  followingUserName?: string | string[];
  type?: string;
  status: string;
  sort: string | null;
  routinesLength?: number;
};

export default function ClubRoutines() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [routines, setRoutines] = useState<RoutineType[]>();
  const [hasMore, setHasMore] = useState(false);
  const [openValue, setOpenValue] = useState<string | null>();
  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "wait" | "scanOverlay" | "createTaskOverlay" | "content"
  >("loading");
  const [showScanOverlay, setShowScanOverlay] = useState<boolean>();
  const [scanOverlayButtonText, setScanOverlayButtonText] = useState("");
  const [scanOverlayMessage, setScanOverlayMessage] = useState("");
  const [pageLoaded, setPageLoaded] = useState(false);

  const { userDetails } = useContext(UserContext);
  const { nextScan, timeZone, specialConsiderations } = userDetails || {};

  const status = searchParams.get("status") || "active";
  const sort = searchParams.get("sort");

  const handleChangeSegment = (segmentName?: string | null) => {
    if (!segmentName) return;
    const query = modifyQuery({
      params: [{ name: "status", value: segmentName, action: "replace" }],
    });

    router.replace(`${pathname}${query ? `?${query}` : ""}`);
  };

  const handleFetchRoutines = useCallback(
    async ({ skip, sort, status, routinesLength }: GetRoutinesProps) => {
      try {
        const response = await fetchRoutines({
          skip,
          sort,
          status,
          routinesLength: routinesLength || 0,
        });

        const { message } = response;

        if (message) {
          if (skip) {
            setRoutines((prev) => [...(prev || []), ...message.slice(0, 20)]);
            setHasMore(message.length === 21);
          } else {
            setRoutines(message.slice(0, 20));
            if (!openValue) setOpenValue(message[0]?._id);
          }
        }
      } catch (err) {}
    },
    [routines]
  );

  const accordionItems = useMemo(
    () =>
      routines?.map((routine) => {
        return (
          <AccordionRoutineRow
            key={routine._id}
            routine={routine}
            isSelf={true}
            setRoutines={setRoutines}
          />
        );
      }),
    [routines]
  );

  const runningAnalyses: { [key: string]: any } | null = getFromLocalStorage("runningAnalyses");
  const isAnalysisGoing = runningAnalyses?.routine;

  useEffect(() => {
    if (!status) return;
    const payload: GetRoutinesProps = {
      routinesLength: (routines && routines.length) || 0,
      sort,
      status,
    };
    handleFetchRoutines(payload);
  }, [status, sort]);

  useEffect(() => {
    if (!nextScan) return;

    const neverScanned = nextScan.every((r) => !r.date);
    const allPassed = nextScan.every((r) => r.date && new Date() > new Date(r.date || 0));

    if (neverScanned) {
      setScanOverlayButtonText("Scan");
      setScanOverlayMessage("Scan yourself to view routines");
    }

    if (allPassed) {
      setScanOverlayButtonText("Scan again");
      setScanOverlayMessage("It's been one week since your last scan");
    }

    setShowScanOverlay(neverScanned || allPassed);
  }, [userDetails]);

  useEffect(() => {
    if (!routines || !pageLoaded) return;
    if (showScanOverlay === undefined) return;

    if (isAnalysisGoing) {
      setDisplayComponent("wait");
    } else if (showScanOverlay) {
      setDisplayComponent("scanOverlay");
    } else if (routines && routines.length === 0) {
      setDisplayComponent("createTaskOverlay");
    } else if (routines && routines.length > 0) {
      setDisplayComponent("content");
    } else if (routines === undefined) {
      setDisplayComponent("loading");
    }
  }, [isAnalysisGoing, showScanOverlay, routines, pageLoaded]);

  useEffect(() => setPageLoaded(true), []);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeaderWithReturn
          title="My routines"
          filterData={routineSegments}
          selectedValue={status}
          onSelect={handleChangeSegment}
          showReturn
          nowrap
        />
        <ConsiderationsInput
          placeholder={"Special considerations"}
          defaultValue={specialConsiderations || ""}
          maxLength={300}
        />
        <TasksButtons
          disableCreateTask={showScanOverlay}
          handleSaveTask={(props: HandleSaveTaskProps) =>
            saveTaskFromDescription({ ...props, setDisplayComponent })
          }
        />
        {displayComponent === "content" && (
          <Stack className={classes.wrapper}>
            <Accordion
              value={openValue}
              onChange={setOpenValue}
              chevron={false}
              className={`${classes.accordion} scrollbar`}
              classNames={{
                content: classes.content,
                chevron: classes.chevron,
                label: classes.label,
                control: classes.control,
              }}
            >
              {accordionItems}
            </Accordion>
            {hasMore && (
              <ActionIcon
                variant="default"
                className={classes.getMoreButton}
                onClick={() =>
                  handleFetchRoutines({
                    skip: true,
                    routinesLength: (routines && routines.length) || 0,
                    sort,
                    status,
                  })
                }
              >
                <IconArrowDown />
              </ActionIcon>
            )}
          </Stack>
        )}
        {displayComponent === "scanOverlay" && (
          <UploadOverlay buttonText={scanOverlayButtonText} text={scanOverlayMessage} />
        )}
        {displayComponent === "createTaskOverlay" && (
          <CreateTaskOverlay
            timeZone={timeZone}
            handleSaveTask={(props: HandleSaveTaskProps) =>
              saveTaskFromDescription({ ...props, setDisplayComponent })
            }
          />
        )}
        {displayComponent === "wait" && (
          <WaitComponent
            operationKey={"routine"}
            description="Creating your task(s)"
            onComplete={() => {
              handleFetchRoutines({
                routinesLength: (routines && routines.length) || 0,
                sort,
                status,
              });
              setDisplayComponent("content");
            }}
            onError={() => {
              setDisplayComponent("loading");
              deleteFromLocalStorage("runningAnalyses", "routine");
            }}
            customContainerStyles={{ margin: "unset", paddingTop: "15%" }}
          />
        )}
        {displayComponent === "loading" && <Loader style={{ margin: "auto" }} />}
        {routines && (
          <ChatWithModal
            defaultVisibility="open"
            chatCategory={ChatCategoryEnum.ROUTINE}
            openChatKey={ChatCategoryEnum.ROUTINE}
            dividerLabel={"Chat about routine and tasks"}
            modalTitle={
              <Title order={5} component={"p"}>
                Chat about routines and tasks
              </Title>
            }
            customStyles={{ marginTop: "auto" }}
          />
        )}
      </SkeletonWrapper>
    </Stack>
  );
}
