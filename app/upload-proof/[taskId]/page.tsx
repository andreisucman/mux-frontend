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
import { SexEnum, TaskType } from "@/types/global";
import ProofDisplayContainer from "../ProofDisplayContainer";
import { ExistingProofRecordType } from "../types";
import VideoRecorder from "../VideoRecorder";
import classes from "./upload-proof.module.css";

export const runtime = "edge";

type HandleUploadProps = {
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

  const uploadProof = useCallback(
    async ({ recordedBlob, captureType, blurType }: HandleUploadProps) => {
      if (!captureType) return;
      if (!recordedBlob) return;

      try {
        setDisplayComponent("waitComponent");

        const urlArray = await uploadToSpaces({
          itemsArray: [recordedBlob],
          mime: captureType === "image" ? "image/jpeg" : "video/webm",
        });

        const response = await callTheServer({
          endpoint: "uploadProof",
          method: "POST",
          body: { taskId, url: urlArray[0], blurType },
        });

        if (response.status !== 200) {
          setDisplayComponent("videoRecorder");
          openErrorModal({
            description: response.error,
          });

          deleteFromLocalStorage("runningAnalyses", taskId || "");
        }
      } catch (err) {
        setDisplayComponent("videoRecorder");
        deleteFromLocalStorage("runningAnalyses", taskId || "");
      }
    },
    [taskId]
  );

  const handleFetchTaskInfo = useCallback(async (taskId: string) => {
    const taskInfo = await fetchTaskInfo(taskId);
    if (taskInfo) setTaskInfo(taskInfo);
  }, []);

  const handleCompleteUpload = useCallback(async (taskId: string | null) => {
    if (!taskId) return;
    await fetchProofInfo(taskId);
    handleFetchTaskInfo(taskId);
    setDisplayComponent("completed");
    deleteFromIndexedDb("proofVideo");
    deleteFromIndexedDb("proofImage");
  }, []);

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

    if (taskInfo && taskExpired) {
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
          <Stack className={classes.content}>
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
                uploadProof={uploadProof}
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
