import { BlurredUrlType } from "@/types/global";

export type SimpleStyleType = {
  _id: string;
  userId: string;
  styleIcon?: string;
  styleName?: string;
  isPublic?: boolean;
  mainUrl: BlurredUrlType;
  urls: BlurredUrlType[];
  verdict?: string;
  styleKeys: string[];
  styleValues: number[];
  createdAt: string;
};
