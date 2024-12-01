import { PartEnum } from "@/context/UploadPartsChoicesContext/types";
import { ProgressImageType, TypeEnum } from "@/types/global";
import { PositionEnum } from "../scan/types";

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

export type HandleFetchProgressType = {
  type: string;
  part: string | null;
  skip?: boolean;
};
