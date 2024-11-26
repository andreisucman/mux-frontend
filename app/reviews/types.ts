import { DemographicsType, LatestScoresType, ProgressImageType, TypeEnum } from "@/types/global";

export type ReviewCardType = {
  _id: string;
  userId: string | null;
  category: "style" | "progress";
  type: TypeEnum;
  rating: number;
  text: string;
  demographics: DemographicsType;
  images: ProgressImageType[];
  initialImages: ProgressImageType[];
  createdAt: string;
  initialDate: string;
  scoresDifference: LatestScoresType;
  clubName?: string;
};
