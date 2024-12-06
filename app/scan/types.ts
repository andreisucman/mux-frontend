import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { PartEnum } from "@/context/UploadPartsChoicesContext/types";
import { TypeEnum } from "@/types/global";

export type UploadProgressProps = {
  url: string;
  type: TypeEnum;
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
