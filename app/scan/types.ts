import { BlurDotType } from "@/components/UploadCard/types";
import { PartEnum } from "@/context/ScanPartsChoicesContext/types";

export type OffsetType = {
  scaleHeight: number;
  scaleWidth: number;
};

export type UploadProgressProps = {
  url: string;
  part: PartEnum;
  position: string;
  blurDots: BlurDotType[];
  offsets: OffsetType;
};

export enum PositionEnum {
  FRONT = "front",
  BACK = "back",
  RIGHT = "right",
  LEFT = "left",
  MOUTH = "mouth",
  SCALP = "scalp",
}
