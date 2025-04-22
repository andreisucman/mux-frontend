import { PartEnum, ProgressImageType, ScoreDifferenceType, ScoreType } from "@/types/global";

export type SimpleProgressType = {
  _id: string;
  userId: string;
  concerns: PartEnum[];
  part: string;
  initialImages: ProgressImageType[];
  images: ProgressImageType[];
  concernScores: ScoreType[];
  concernScoresDifference: ScoreDifferenceType[];
  createdAt: string;
  initialDate: string;
  isPublic: boolean;
  userName: string;
};

export type HandleUpdateProgressType = {
  contentId: string;
  images: ProgressImageType[];
  initialImages: ProgressImageType[];
};
