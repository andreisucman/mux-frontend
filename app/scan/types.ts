import { BlurDot } from "@/components/UploadCard/types";
import { PartEnum } from "@/context/ScanPartsChoicesContext/types";

export type UploadProgressProps = {
  url: string;
  part: PartEnum;
  position: string;
  blurDots: BlurDot[];
  offsets: { horizontalOffset: number; verticalOffset: number; scale: number };
};

export enum PositionEnum {
  FRONT = "front",
  BACK = "back",
  RIGHT = "right",
  LEFT = "left",
  MOUTH = "mouth",
  SCALP = "scalp",
}
