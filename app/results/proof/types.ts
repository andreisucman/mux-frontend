import { BlurredUrlType } from "@/types/global";

export type SimpleProofType = {
  _id: string;
  userId: string;
  mainUrl: BlurredUrlType;
  mainThumbnail: BlurredUrlType;
  taskName: string;
  concern: string;
  createdAt: string;
  contentType: string;
  isPublic: boolean;
  icon: string;
  userName: string;
};
