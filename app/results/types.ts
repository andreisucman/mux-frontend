import { PartEnum } from "@/context/ScanPartsChoicesContext/types";
import { ProgressImageType, TypeEnum } from "@/types/global";

export type SimpleProgressType = {
  _id: string;
  userId: string;
  type: TypeEnum;
  part: PartEnum;
  initialImages: ProgressImageType[];
  images: ProgressImageType[];
  scores: { [key: string]: number };
  scoresDifference: { [key: string]: number };
  createdAt: string;
  initialDate: string;
  isPublic: boolean;
};

export type HandleUpdateProgressType = {
  contentId: string;
  images: ProgressImageType[];
  initialImages: ProgressImageType[];
};
