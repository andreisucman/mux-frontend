import { BlurredUrlType } from "@/types/global";

export type ExistingProofRecordType = {
  _id: string;
  createdAt: string;
  mainUrl: BlurredUrlType;
  contentType: string;
  hash: string;
  isPublic: boolean;
  mainThumbnail: BlurredUrlType;
};
