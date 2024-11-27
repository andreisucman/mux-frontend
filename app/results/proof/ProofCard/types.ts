import { BlurredUrlType } from "@/types/global";

export type ProofCardType = {
  _id: string;
  taskName: string;
  clubName: string;
  mainUrl: BlurredUrlType;
  urls: BlurredUrlType[];
  mainThumbnail: BlurredUrlType;
  thumbnails: BlurredUrlType[];
  taskId: string;
  requisite: string;
  userId: string;
  routineId: string;
  createdAt: string;
  taskKey: string;
  type: string;
  icon: string;
  avatar: { [key: string]: any };
  contentType: "video" | "image";
  latestFaceScoreDifference?: { [key: string]: number };
  latestBodyScoreDifference?: { [key: string]: number };
  concern: string;
  isTracked?: boolean;
  isLite?: boolean;
  isPublic: boolean;
};
