import { PartEnum, ProgressImageType, ScoreDifferenceType, ScoreType } from "@/types/global";

export type SimpleProgressType = {
  _id: string;
  userId: string;
  concern: PartEnum;
  initialImages: ProgressImageType[];
  images: ProgressImageType[];
  concernScore?: ScoreType;
  concernScoreDifference?: ScoreDifferenceType;
  createdAt: string;
  initialDate: string;
  isPublic: boolean;
};

export type HandleUpdateProgressType = {
  contentId: string;
  images: ProgressImageType[];
  initialImages: ProgressImageType[];
};
