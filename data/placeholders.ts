import { StaticImageData } from "next/image";
import femaleBodyBack from "@/public/assets/placeholders/female-body-back.svg";
import femaleBodyFront from "@/public/assets/placeholders/female-body-front.svg";
import femaleBodyLeft from "@/public/assets/placeholders/female-body-left.svg";
import femaleBodyRight from "@/public/assets/placeholders/female-body-right.svg";
import femaleHeadFront from "@/public/assets/placeholders/female-head-front.svg";
import femaleHeadLeft from "@/public/assets/placeholders/female-head-left.svg";
import femaleHeadRight from "@/public/assets/placeholders/female-head-right.svg";
import femaleMouth from "@/public/assets/placeholders/female-mouth.svg";
import femaleScalp from "@/public/assets/placeholders/female-scalp.svg";
import femaleStyleBody from "@/public/assets/placeholders/female-style-body.svg";
import femaleStyleHead from "@/public/assets/placeholders/female-style-head.svg";
import food from "@/public/assets/placeholders/food.svg";
import maleBodyBack from "@/public/assets/placeholders/male-body-back.svg";
import maleBodyFront from "@/public/assets/placeholders/male-body-front.svg";
import maleBodyLeft from "@/public/assets/placeholders/male-body-left.svg";
import maleBodyRight from "@/public/assets/placeholders/male-body-right.svg";
import maleHeadFront from "@/public/assets/placeholders/male-head-front.svg";
import maleHeadLeft from "@/public/assets/placeholders/male-head-left.svg";
import maleHeadRight from "@/public/assets/placeholders/male-head-right.svg";
import maleMouth from "@/public/assets/placeholders/male-mouth.svg";
import maleScalp from "@/public/assets/placeholders/male-scalp.svg";
import maleStyleBody from "@/public/assets/placeholders/male-style-body.svg";
import maleStyleHead from "@/public/assets/placeholders/male-style-head.svg";
import health from "@/public/assets/placeholders/medical-test.svg";
import { PositionEnum, ScanTypeEnum, TypeEnum } from "@/types/global";

export const placeholders: {
  sex: string[];
  scanType: ScanTypeEnum;
  type?: TypeEnum;
  position?: PositionEnum;
  url: StaticImageData;
}[] = [
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.HEAD,
    position: PositionEnum.FRONT,
    url: maleHeadFront,
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.HEAD,
    position: PositionEnum.RIGHT,
    url: maleHeadRight,
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.HEAD,
    position: PositionEnum.LEFT,
    url: maleHeadLeft,
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.HEAD,
    position: PositionEnum.SCALP,
    url: maleScalp,
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.HEAD,
    position: PositionEnum.MOUTH,
    url: maleMouth,
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.STYLE,
    type: TypeEnum.HEAD,
    position: PositionEnum.FRONT,
    url: maleStyleHead,
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.STYLE,
    type: TypeEnum.BODY,
    position: PositionEnum.FRONT,
    url: maleStyleBody,
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.BODY,
    position: PositionEnum.FRONT,
    url: maleBodyFront,
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.BODY,
    position: PositionEnum.RIGHT,
    url: maleBodyRight,
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.BODY,
    position: PositionEnum.LEFT,
    url: maleBodyLeft,
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.BODY,
    position: PositionEnum.BACK,
    url: maleBodyBack,
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.HEAD,
    position: PositionEnum.FRONT,
    url: femaleHeadFront,
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.HEAD,
    position: PositionEnum.RIGHT,
    url: femaleHeadRight,
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.STYLE,
    type: TypeEnum.HEAD,
    position: PositionEnum.FRONT,
    url: femaleStyleHead,
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.STYLE,
    type: TypeEnum.BODY,
    position: PositionEnum.FRONT,
    url: femaleStyleBody,
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.HEAD,
    position: PositionEnum.LEFT,
    url: femaleHeadLeft,
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.HEAD,
    position: PositionEnum.SCALP,
    url: femaleScalp,
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.HEAD,
    position: PositionEnum.MOUTH,
    url: femaleMouth,
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.BODY,
    position: PositionEnum.FRONT,
    url: femaleBodyFront,
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.BODY,
    position: PositionEnum.RIGHT,
    url: femaleBodyRight,
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.BODY,
    position: PositionEnum.LEFT,
    url: femaleBodyLeft,
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    type: TypeEnum.BODY,
    position: PositionEnum.BACK,
    url: femaleBodyBack,
  },
  {
    sex: ["male", "female"],
    scanType: ScanTypeEnum.FOOD,
    position: PositionEnum.FRONT,
    type: "food" as any,
    url: food,
  },
  {
    sex: ["male", "female"],
    scanType: ScanTypeEnum.HEALTH,
    type: TypeEnum.HEALTH,
    position: PositionEnum.FRONT,
    url: health,
  },
];
