import { PartEnum } from "@/context/UploadPartsChoicesContext/types";
import {
  DemographicsType,
  LatestScoresType,
  ProgressImageType,
  TypeEnum,
  UserConcernType,
} from "@/types/global";

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
  updatedAt: Date;
  demographics: DemographicsType;
  concerns: UserConcernType[];
  avatar?: { [key: string]: any };
  clubName?: string;
  latestScoresDifference: LatestScoresType;
};
