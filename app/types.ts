import {
  AvatarType,
  DemographicsType,
  PartEnum,
  ProgressImageType,
  ScoreDifferenceType,
  ScoreType,
  UserConcernType,
} from "@/types/global";

export type BeforeAfterType = {
  _id: string;
  userId: string;
  part: PartEnum;
  initialImages: ProgressImageType[];
  images: ProgressImageType[];
  concernScore?: ScoreType;
  concernScoreDifference?: ScoreDifferenceType;
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
