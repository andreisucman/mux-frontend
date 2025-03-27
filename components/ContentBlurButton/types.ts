import { OffsetType } from "@/app/scan/types";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { BlurDotType } from "../UploadCard/types";

export type HandleSaveBlurProps = {
  blurDots: BlurDotType[];
  offsets: OffsetType;
  image: string;
};

export type HandleUpdateRecordType = {
  contentId: string;
  updateObject: { [key: string]: any };
};

export type HandleSelectProps = {
  blurType: BlurTypeEnum;
  contentId: string;
};
