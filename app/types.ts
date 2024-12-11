import { PartEnum } from "@/context/UploadPartsChoicesContext/types";
import { DemographicsType, ProgressImageType, TypeEnum, UserConcernType } from "@/types/global";

export type SimpleBeforeAfterType = {
  _id: string;
  userId: string;
  type: TypeEnum;
  part: PartEnum;
  initialImages: ProgressImageType[];
  images: ProgressImageType[];
  scores: { [key: string]: number };
  scoresDifference: { [key: string]: number };
  initialDate: string;
  isPublic: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  demographics: DemographicsType;
  concerns: UserConcernType[];
  avatar: { [key: string]: any } | null;
  clubName: string | null;
  latestBodyScoreDifference: number;
  latestHeadScoreDifference: number;
};
