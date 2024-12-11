"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconHourglassLow } from "@tabler/icons-react";
import { Skeleton, Stack } from "@mantine/core";
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
import {
  deleteFromLocalStorage,
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import { SexEnum, TaskType } from "@/types/global";
import SkeletonWrapper from "../SkeletonWrapper";
import ProofDisplayContainer from "./ProofDisplayContainer";
import { ExistingProofRecordType } from "./types";
import VideoRecorder from "./VideoRecorder";
import classes from "./upload-proof.module.css";

export const runtime = "edge";

type HandleUploadProps = {
  blurType: BlurTypeEnum;
  captureType: "image" | "video";
  recordedBlob: Blob;
  publishToClub: boolean;
  removeFromLocalStorage: () => Promise<void>;
};

export default function UploadProof() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, userDetails } = useContext(UserContext);
  const [componentToDisplay, setComponentToDisplay] = useState<
    "loading" | "expired" | "waitComponent" | "videoRecorder" | "completed"
  >("loading");
  const [taskInfo, setTaskInfo] = useState<TaskType | null>(null);
  const [existingProofRecord, setExistingProofRecord] = useState<ExistingProofRecordType | null>(
    null
  );

  const taskId = searchParams.get("taskId");
  const submissionName = searchParams.get("submissionName");
  const submissionId = searchParams.get("submissionId");
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
    } catch (err) {
      console.log("Error in fetchProofInfo: ", err);
    }
  }, []);

  const uploadProof = useCallback(
    async ({ recordedBlob, captureType, blurType }: HandleUploadProps) => {
      if (status !== "authenticated") return;

      try {
        setComponentToDisplay("waitComponent");

        const urlArray = await uploadToSpaces({
          itemsArray: [recordedBlob],
          mime: captureType === "image" ? "image/jpeg" : "video/webm",
        });

        const response = await callTheServer({
          endpoint: "uploadProof",
          method: "POST",
          body: { taskId, url: urlArray[0], submissionId, blurType },
        });

        if (response.status !== 200) {
          setComponentToDisplay("videoRecorder");
          openErrorModal({
            description: response.error,
          });

          saveToLocalStorage("runningAnalyses", { [taskId || ""]: false }, "add");
        }

        deleteFromIndexedDb(captureType === "image" ? "proofImage" : "proofVideo");
      } catch (err) {
        console.log("Error in uploadProof: ", err);
        setComponentToDisplay("videoRecorder");
        saveToLocalStorage("runningAnalyses", { [taskId || ""]: false }, "add");
      }
    },
    [status, taskId]
  );

  const handleFetchTaskInfo = useCallback(async (taskId: string) => {
    const taskInfo = await fetchTaskInfo(taskId);
    if (taskInfo) setTaskInfo(taskInfo);
  }, []);

  const handleCompleteUpload = useCallback(async (taskId: string) => {
    if (!taskId) return;
    await fetchProofInfo(taskId);
    handleFetchTaskInfo(taskId);
    setComponentToDisplay("completed");
  }, []);

  useEffect(() => {
    if (!taskId) return;
    handleFetchTaskInfo(taskId);
    fetchProofInfo(taskId);
  }, [taskId]);

  useEffect(() => {
    if (!taskId) return;

    if (!taskInfo) {
      setComponentToDisplay("loading");
      return;
    }

    if (taskInfo && taskExpired) {
      setComponentToDisplay("expired");
      return;
    }

    const runningAnalyses: { [key: string]: any } | null = getFromLocalStorage("runningAnalyses");

    let analysisStatus;

    if (runningAnalyses) {
      analysisStatus = runningAnalyses[taskId];
    }

    if (analysisStatus) {
      setComponentToDisplay("waitComponent");
    } else if (taskStatus === "completed") {
      setComponentToDisplay("completed");
    } else {
      setComponentToDisplay("videoRecorder");
    }
  }, [taskId, taskInfo, taskExpired]);

  return (
    <Stack flex={1} className="smallPage">
      <SkeletonWrapper>
        <PageHeader
          title={`Upload proof - ${submissionName}`}
          showReturn
          hideTypeDropdown
          hidePartDropdown
        />
        <Skeleton className="skeleton" visible={componentToDisplay === "loading"}>
          <Stack className={classes.content}>
            {componentToDisplay === "completed" && existingProofRecord && (
              <ProofDisplayContainer
                existingProofRecord={existingProofRecord}
                setExistingProofRecord={setExistingProofRecord}
              />
            )}
            {componentToDisplay === "waitComponent" && (
              <WaitComponent
                operationKey={taskId || ""}
                description="Checking your upload"
                onComplete={handleCompleteUpload}
                hideDisclaimer
                onError={() => {
                  setComponentToDisplay("videoRecorder");
                  deleteFromLocalStorage("runningAnalyses", taskId || "");
                }}
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
              <OverlayWithText
                text="This task expired"
                icon={<IconHourglassLow className="icon" />}
                buttonText="Return"
                onButtonClick={() => router.replace("/routines")}
              />
            )}
          </Stack>
        </Skeleton>
      </SkeletonWrapper>
    </Stack>
  );
}
