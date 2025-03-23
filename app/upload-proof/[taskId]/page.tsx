"use client";

import React, { use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { useRouter } from "@/helpers/custom-router";
import { deleteFromIndexedDb } from "@/helpers/indexedDb";
import openErrorModal from "@/helpers/openErrorModal";
import { SexEnum, TaskExampleType, TaskStatusEnum, TaskType } from "@/types/global";
import ProofDisplayContainer from "../ProofDisplayContainer";
import { ExistingProofRecordType } from "../types";
import VideoRecorder from "../VideoRecorder";

export const runtime = "edge";

type HandleUploadProps = {
  taskId: string;
  blurType: BlurTypeEnum;
  captureType: "image" | "video";
  recordedBlob: Blob;
  publishToClub: boolean;
  removeFromLocalStorage: () => Promise<void>;
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
    "loading" | "expired" | "waitComponent" | "videoRecorder" | "completed"
  >("loading");
  const [taskInfo, setTaskInfo] = useState<TaskType | null>(null);
  const [existingProofRecord, setExistingProofRecord] = useState<ExistingProofRecordType | null>(
    null
  );
  const [isAnalysisGoing, setIsAnalysisGoing] = useState(false);
  const [isSetTaskExampleLoading, setIsSetTaskExampleLoading] = useState(false);

  const submissionName = searchParams.get("submissionName");
  const { status: taskStatus, expiresAt, requisite } = taskInfo || {};

  const { demographics, _id: userId } = userDetails || {};
  const { sex } = demographics || {};

  const taskExpired = new Date(expiresAt || 0) < new Date();

  const fetchProofInfo = useCallback(async (taskId: string | null) => {
    if (!taskId) return;

    const response = await callTheServer({
      endpoint: `getProofRecord/${taskId}`,
      method: "GET",
    });

    if (response.status === 200) {
      setExistingProofRecord(response.message);
    }
  }, []);

  const uploadProof = async ({
    taskId,
    recordedBlob,
    captureType,
    blurType,
  }: HandleUploadProps) => {
    if (!taskId || !captureType || !recordedBlob) return;

    try {
      const finalMime = captureType === "image" ? "image/jpeg" : "video/webm";

      const urlArray = await uploadToSpaces({
        itemsArray: [recordedBlob],
        mime: finalMime,
      });

      const finalBlurType = captureType === "image" ? blurType : BlurTypeEnum.ORIGINAL;

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const response = await callTheServer({
        endpoint: "uploadProof",
        method: "POST",
        body: {
          taskId,
          url: urlArray[0],
          blurType: finalBlurType,
          timeZone,
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
    await fetchProofInfo(taskId);
    handleFetchTaskInfo(taskId);
    setDisplayComponent("completed");
    deleteFromIndexedDb("proofVideo");
    deleteFromIndexedDb("proofImage");
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
    if (isAnalysisGoing) {
      setDisplayComponent("waitComponent");
    } else if (taskStatus === "completed") {
      setDisplayComponent("completed");
    } else {
      setDisplayComponent("videoRecorder");
    }
  }, [taskId, taskInfo, taskExpired, isAnalysisGoing]);

  useEffect(() => {
    if (!userId || !taskId) return;

    checkIfAnalysisRunning({
      userId,
      operationKey: taskId,
      setShowWaitComponent: setIsAnalysisGoing,
    });
  }, [userId, taskId]);

  const overlayButton = (
    <Button mt={8} variant="default" onClick={() => router.replace("/tasks")}>
      Return
    </Button>
  );

  const handleUpdateExample = useCallback(
    async (example?: TaskExampleType | null) => {
      if (isSetTaskExampleLoading || !taskInfo) return;
      setIsSetTaskExampleLoading(true);

      const response = await callTheServer({
        endpoint: "updateTaskExamples",
        method: "POST",
        body: { taskId: taskInfo?._id, example },
      });

      if (response.status === 200) {
        setIsSetTaskExampleLoading(false);

        setTaskInfo((prev: any) => {
          return { ...(prev || {}), example };
        });
      }
    },
    [taskInfo, isSetTaskExampleLoading]
  );

  const setExampleButtonInfo = useMemo(() => {
    if (!existingProofRecord || !taskInfo) return;

    const response: { [key: string]: any } = {};
    let text = null;
    let color = "var(--mantine-color-gray-2)";

    const alreadyExists = taskInfo.examples.some((e) => e.url === existingProofRecord.mainUrl.url);

    if (alreadyExists) {
      color = "var(--mantine-color-green-7)";
      text = (
        <Group gap={6} style={{ color }}>
          <IconCheckbox className="icon" color={color} /> Set as task example
        </Group>
      );
    } else {
      text = (
        <Group gap={6} color={color}>
          <IconCirclePlus className="icon" /> Set as task example
        </Group>
      );
    }

    response.text = text;

    if (alreadyExists) {
      setTaskInfo((prev: any) => {
        const filtered = prev.examples.filter(
          (e: TaskExampleType) => e.url !== existingProofRecord.mainUrl.url
        );
        return { ...(prev || {}), examples: filtered };
      });
    } else {
      response.onClick = () =>
        handleUpdateExample({
          type: existingProofRecord.contentType,
          url: existingProofRecord.mainUrl.url || "",
        });
    }
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
                customWrapperStyles={{ transform: "translateY(-50%)" }}
              />
            )}
            {componentToDisplay === "videoRecorder" && status === "authenticated" && (
              <VideoRecorder
                sex={sex || SexEnum.FEMALE}
                taskExpired={taskExpired}
                instruction={requisite || ""}
                uploadProof={(otherArgs) => uploadProof({ taskId, ...otherArgs })}
              />
            )}
            {componentToDisplay === "expired" && (
              <OverlayWithText text="This task expired" button={overlayButton} />
            )}
          </Stack>
        </Skeleton>
      </SkeletonWrapper>
    </Stack>
  );
}
