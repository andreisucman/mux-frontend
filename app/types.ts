import {
  AvatarType,
  DemographicsType,
  PartEnum,
  ProgressImageType,
  ScoreDifferenceType,
  ScoreType,
} from "@/types/global";

export type BeforeAfterType = {
  _id: string;
  userId: string;
  part: PartEnum;
  concern: string;
  initialImages: ProgressImageType[];
  images: ProgressImageType[];
  concernScore: ScoreType;
  concernScoreDifference: ScoreDifferenceType;
  initialDate: string;
  isPublic: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  demographics: DemographicsType;
  avatar: AvatarType | null;
  routineName?: string;
  userName: string | null;
  progresses?: { progressId: string; createdAt: string }[];
};
