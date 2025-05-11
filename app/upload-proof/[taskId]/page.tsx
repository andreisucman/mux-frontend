"use client";

import React, { use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconCheckbox, IconCirclePlus } from "@tabler/icons-react";
import { Button, Group, Skeleton, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import WaitComponent from "@/components/WaitComponent";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import checkIfAnalysisRunning from "@/functions/checkIfAnalysisRunning";
import fetchTaskInfo from "@/functions/fetchTaskInfo";
import uploadToSpaces from "@/functions/uploadToSpaces";
import { formatDate } from "@/helpers/formatDate";
import { deleteFromIndexedDb } from "@/helpers/indexedDb";
import openErrorModal from "@/helpers/openErrorModal";
import { SexEnum, TaskExampleType, TaskStatusEnum, TaskType } from "@/types/global";
import ProofDisplayContainer from "../ProofDisplayContainer";
import { ExistingProofRecordType } from "../types";
import VideoRecorder from "../VideoRecorder";

export const runtime = "edge";

type HandleUploadProps = {
  taskId: string;
  captureType: "image" | "video";
  recordedBlob: Blob | null;
};

type Props = {
  params: Promise<{ taskId: string }>;
};

export default function UploadProof(props: Props) {
  const { taskId } = use(props.params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, userDetails } = useContext(UserContext);
  const [componentToDisplay, setDisplayComponent] = useState<
    "loading" | "expired" | "waitComponent" | "videoRecorder" | "completed" | "notStarted"
  >("loading");
  const [taskInfo, setTaskInfo] = useState<TaskType | null>(null);
  const [existingProofRecord, setExistingProofRecord] = useState<ExistingProofRecordType | null>(
    null
  );
  const [isAnalysisGoing, setIsAnalysisGoing] = useState(false);
  const [isSetTaskExampleLoading, setIsSetTaskExampleLoading] = useState(false);

  const submissionName = searchParams.get("submissionName");
  const { status: taskStatus, startsAt, expiresAt, requisite } = taskInfo || {};

  const { demographics, _id: userId } = userDetails || {};
  const { sex } = demographics || {};

  const taskExpired = new Date(expiresAt || 0) < new Date();
  const taskNotStarted = new Date(startsAt || 0) > new Date();

  const fetchProofInfo = useCallback(
    async (taskId: string | null) => {
      if (!taskId) return;

      const response = await callTheServer({
        endpoint: `getProofRecord/${taskId}`,
        method: "GET",
      });

      if (response.status === 200) {
        setExistingProofRecord(response.message);
      }
    },
    [taskId]
  );

  const uploadProof = async ({ taskId, recordedBlob, captureType }: HandleUploadProps) => {
    if (!taskId || !captureType || !recordedBlob) return;

    try {
      const finalMime = captureType === "image" ? "image/jpeg" : "video/webm";

      const urlArray = await uploadToSpaces({
        itemsArray: [recordedBlob],
        mime: finalMime,
      });

      const response = await callTheServer({
        endpoint: "uploadProof",
        method: "POST",
        body: {
          taskId,
          url: urlArray[0],
          blurType: BlurTypeEnum.ORIGINAL,
        },
      });

      if (response.status !== 200) {
        setDisplayComponent("videoRecorder");
        openErrorModal({
          description: response.error,
        });

        setIsAnalysisGoing(false);
      }

      setDisplayComponent("waitComponent");
    } catch (err) {
      setDisplayComponent("videoRecorder");
      setIsAnalysisGoing(false);
    }
  };

  const handleFetchTaskInfo = async (taskId: string) => {
    const taskInfo = await fetchTaskInfo(taskId);
    if (taskInfo) setTaskInfo(taskInfo);
  };

  const handleCompleteUpload = async (taskId: string | null) => {
    if (!taskId) return;
    deleteFromIndexedDb(`proofVideo-${taskId}`);
    deleteFromIndexedDb(`proofImage-${taskId}`);
    await fetchProofInfo(taskId);
    handleFetchTaskInfo(taskId);
    setDisplayComponent("completed");
  };

  useEffect(() => {
    if (!taskId) return;
    handleFetchTaskInfo(taskId);
    fetchProofInfo(taskId);
  }, [taskId]);

  useEffect(() => {
    if (!taskId) return;

    if (!taskInfo) {
      setDisplayComponent("loading");
      return;
    }

    if (taskInfo && taskExpired && taskInfo.status !== TaskStatusEnum.COMPLETED) {
      setDisplayComponent("expired");
      return;
    }
    if (taskNotStarted) {
      setDisplayComponent("notStarted");
      return;
    }
    if (isAnalysisGoing) {
      setDisplayComponent("waitComponent");
    } else if (taskStatus === "completed") {
      setDisplayComponent("completed");
    } else {
      setDisplayComponent("videoRecorder");
    }
  }, [taskId, taskInfo, taskNotStarted, taskExpired, isAnalysisGoing]);

  useEffect(() => {
    if (!userId || !taskId) return;

    checkIfAnalysisRunning({
      userId,
      operationKey: taskId,
      setShowWaitComponent: (verdict?: boolean) => setIsAnalysisGoing(!!verdict),
    });
  }, [userId, taskId]);

  const handleUpdateExample = useCallback(
    async (examples?: TaskExampleType[]) => {
      if (isSetTaskExampleLoading || !taskInfo) return;
      setIsSetTaskExampleLoading(true);

      const response = await callTheServer({
        endpoint: "updateTaskExamples",
        method: "POST",
        body: { taskId: taskInfo?._id, examples },
      });

      if (response.status === 200) {
        setIsSetTaskExampleLoading(false);
      }
    },
    [taskInfo, isSetTaskExampleLoading]
  );

  const overlayButton = (
    <Button mt={8} variant="default" onClick={() => router.replace("/tasks")}>
      Return
    </Button>
  );

  const setExampleButtonInfo = useMemo(() => {
    if (!existingProofRecord || !taskInfo) return;

    const response: { [key: string]: any } = {};
    let text = null;
    let color = "var(--mantine-color-gray-1)";

    const alreadyExists = taskInfo.examples.some((e) => e.url === existingProofRecord.mainUrl.url);

    if (alreadyExists) {
      color = "var(--mantine-color-green-7)";
      text = (
        <Group gap={6} style={{ color }}>
          <IconCheckbox size={16} color={color} /> Set as task example
        </Group>
      );
      response.onClick = () =>
        setTaskInfo((prev: any) => {
          const filtered = prev.examples.filter(
            (e: TaskExampleType) => e.url !== existingProofRecord.mainUrl.url
          );
          handleUpdateExample(filtered);
          return { ...(prev || {}), examples: filtered };
        });
    } else {
      text = (
        <Group gap={6} color={color}>
          <IconCirclePlus size={16} /> Set as task example
        </Group>
      );
      response.onClick = () => {
        setTaskInfo((prev: any) => {
          const example = {
            type: existingProofRecord.contentType,
            url: existingProofRecord.mainUrl.url || "",
          };
          const newExamples = [example, ...prev.examples];
          handleUpdateExample(newExamples);
          return { ...(prev || {}), examples: newExamples };
        });
      };
    }

    response.text = text;

    return response;
  }, [existingProofRecord, taskInfo]);

  return (
    <Stack flex={1} className="smallPage">
      <SkeletonWrapper>
        <PageHeader title={`Proof - ${submissionName}`} nowrapContainer />
        <Skeleton className="skeleton" visible={componentToDisplay === "loading"}>
          <Stack flex={1}>
            {componentToDisplay === "completed" && existingProofRecord && (
              <>
                {setExampleButtonInfo?.text && (
                  <Button
                    variant="default"
                    size="compact-sm"
                    onClick={setExampleButtonInfo?.onClick}
                    loading={isSetTaskExampleLoading}
                    disabled={isSetTaskExampleLoading}
                  >
                    {setExampleButtonInfo?.text}
                  </Button>
                )}
                <ProofDisplayContainer existingProofRecord={existingProofRecord} />
              </>
            )}
            {componentToDisplay === "waitComponent" && (
              <WaitComponent
                operationKey={taskId || ""}
                description="Checking your upload"
                onComplete={() => {
                  handleCompleteUpload(taskId);
                  setDisplayComponent("loading");
                  setIsAnalysisGoing(false);
                }}
                hideDisclaimer
                onError={() => {
                  setDisplayComponent("videoRecorder");
                  setIsAnalysisGoing(false);
                }}
              />
            )}
            {componentToDisplay === "videoRecorder" && status === "authenticated" && (
              <VideoRecorder
                sex={sex || SexEnum.FEMALE}
                taskExpired={taskExpired}
                instruction={requisite || ""}
                taskId={taskId}
                uploadProof={(otherArgs) =>
                  uploadProof({
                    taskId,
                    captureType: otherArgs.captureType as "image",
                    recordedBlob: otherArgs.recordedBlob,
                  })
                }
              />
            )}
            {componentToDisplay === "expired" && (
              <OverlayWithText text="This task expired" button={overlayButton} />
            )}
            {componentToDisplay === "notStarted" && (
              <OverlayWithText
                text={`This task starts on ${formatDate({ date: taskInfo?.startsAt || new Date() })}`}
                button={overlayButton}
              />
            )}
          </Stack>
        </Skeleton>
      </SkeletonWrapper>
    </Stack>
  );
}
