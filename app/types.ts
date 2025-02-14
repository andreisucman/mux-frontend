
import { PartEnum } from "@/context/ScanPartsChoicesContext/types";
import { DemographicsType, ProgressImageType, UserConcernType } from "@/types/global";

export type SimpleBeforeAfterType = {
  _id: string;
  userId: string;
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
  userName: string | null;
};
