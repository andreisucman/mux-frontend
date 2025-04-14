import { OffsetType } from "@/app/select-part/types";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { BlurDotType } from "../UploadCard/types";

export type OnUpdateBlurProps = {
  blurDots: BlurDotType[];
  offsets: OffsetType;
  url: string;
};

export type HandleSelectProps = {
  blurType: BlurTypeEnum;
  contentId: string;
};
