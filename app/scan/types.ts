import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { PartEnum } from "@/context/ScanPartsChoicesContext/types";

export type UploadProgressProps = {
  url: string;
  part: PartEnum;
  position: string;
  blurType: BlurTypeEnum;
  blurredImage: string;
};

export enum PositionEnum {
  FRONT = "front",
  BACK = "back",
  RIGHT = "right",
  LEFT = "left",
  MOUTH = "mouth",
  SCALP = "scalp",
}
