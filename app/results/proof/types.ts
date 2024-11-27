import { BlurredUrlType } from "@/types/global";

export type SimpleProofType = {
  _id: string;
  userId: string;
  mainUrl: BlurredUrlType;
  mainThumbnail: BlurredUrlType;
  urls: BlurredUrlType[];
  thumbnails: BlurredUrlType[];
  taskName: string;
  concern: string;
  createdAt: string;
  contentType: string;
  isTracked?: boolean;
  isPublic: boolean;
  icon: string;
};

export type HandleFetchProofType = {
  type: string;
  part: string | null;
  concern: string | null;
  skip?: boolean;
};
