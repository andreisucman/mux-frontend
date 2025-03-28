import { OffsetType } from "@/app/scan/types";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { BlurDotType } from "../UploadCard/types";

export type OnUpdateBlurProps = {
  blurDots: BlurDotType[];
  offsets: OffsetType;
  url: string;
  position: string;
};

export type HandleSelectProps = {
  blurType: BlurTypeEnum;
  contentId: string;
};
