import { BlurredUrlType } from "@/types/global";

export type HandleUpdateStylesType = {
  contentId: string;
  mainUrl: BlurredUrlType;
  initialMainUrl: BlurredUrlType;
};

export type HandleFetchStylesType = {
  type: string;
  styleName?: string | null;
  skip?: boolean;
};
