import { PartEnum } from "@/context/ScanPartsChoicesContext/types";
import { AvatarType, DemographicsType, ProgressImageType, UserConcernType } from "@/types/global";

export type BeforeAfterType = {
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
  avatar: AvatarType | null;
  routineName?: string;
  userName: string | null;
  progresses?: { progressId: string; createdAt: string }[];
};
