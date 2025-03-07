"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Skeleton, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import WaitComponent from "@/components/WaitComponent";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import fetchTaskInfo from "@/functions/fetchTaskInfo";
import uploadToSpaces from "@/functions/uploadToSpaces";
import { useRouter } from "@/helpers/custom-router";
import { deleteFromIndexedDb } from "@/helpers/indexedDb";
import { deleteFromLocalStorage, getFromLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import { SexEnum, TaskStatusEnum, TaskType } from "@/types/global";
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

  const submissionName = searchParams.get("submissionName");
  const { status: taskStatus, expiresAt, requisite } = taskInfo || {};

  const { demographics } = userDetails || {};
  const { sex } = demographics || {};

  const taskExpired = new Date(expiresAt || 0) < new Date();

  const fetchProofInfo = useCallback(async (taskId: string | null) => {
    if (!taskId) return;
    try {
      const response = await callTheServer({
        endpoint: `getProofRecord/${taskId}`,
        method: "GET",
      });

      if (response.status === 200) {
        setExistingProofRecord(response.message);
      }
    } catch (err) {}
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

      const response = await callTheServer({
        endpoint: "uploadProof",
        method: "POST",
        body: { taskId, url: urlArray[0], blurType: finalBlurType },
      });

      if (response.status !== 200) {
        setDisplayComponent("videoRecorder");
        openErrorModal({
          description: response.error,
        });

        deleteFromLocalStorage("runningAnalyses", taskId);
      }

      setDisplayComponent("waitComponent");
    } catch (err) {
      setDisplayComponent("videoRecorder");
      deleteFromLocalStorage("runningAnalyses", taskId);
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

    const runningAnalyses: { [key: string]: any } | null = getFromLocalStorage("runningAnalyses");

    let analysisStatus;

    if (runningAnalyses) {
      analysisStatus = runningAnalyses[taskId];
    }

    if (analysisStatus) {
      setDisplayComponent("waitComponent");
    } else if (taskStatus === "completed") {
      setDisplayComponent("completed");
    } else {
      setDisplayComponent("videoRecorder");
    }
  }, [taskId, taskInfo, taskExpired]);

  const overlayButton = (
    <Button mt={8} variant="default" onClick={() => router.replace("/tasks")}>
      Return
    </Button>
  );

  return (
    <Stack flex={1} className="smallPage">
      <SkeletonWrapper>
        <PageHeader title={`Proof - ${submissionName}`} showReturn nowrapContainer />
        <Skeleton className="skeleton" visible={componentToDisplay === "loading"}>
          <Stack flex={1}>
            {componentToDisplay === "completed" && existingProofRecord && (
              <ProofDisplayContainer existingProofRecord={existingProofRecord} />
            )}
            {componentToDisplay === "waitComponent" && (
              <WaitComponent
                operationKey={taskId || ""}
                description="Checking your upload"
                onComplete={() => handleCompleteUpload(taskId)}
                hideDisclaimer
                onError={() => {
                  setDisplayComponent("videoRecorder");
                  deleteFromLocalStorage("runningAnalyses", taskId || "");
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
