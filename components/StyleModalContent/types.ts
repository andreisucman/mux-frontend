import { BlurredUrlType } from "@/types/global";

export type SimpleStyleType = {
  _id: string;
  userId: string;
  styleIcon?: string;
  isPublic: boolean;
  mainUrl: BlurredUrlType;
  initialMainUrl: BlurredUrlType;
  urls: BlurredUrlType[];
  styleName?: string;
  styleKeys: string[];
  styleValues: number[];
  createdAt: string;
};
