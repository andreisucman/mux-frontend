import { StaticImageData } from "next/image";
import { PartEnum } from "@/context/ScanPartsChoicesContext/types";
import femaleBodyBack from "@/public/assets/placeholders/female-body-back.svg";
import femaleBodyFront from "@/public/assets/placeholders/female-body-front.svg";
import femaleBodyLeft from "@/public/assets/placeholders/female-body-left.svg";
import femaleBodyRight from "@/public/assets/placeholders/female-body-right.svg";
import femaleHeadFront from "@/public/assets/placeholders/female-head-front.svg";
import femaleHeadLeft from "@/public/assets/placeholders/female-head-left.svg";
import femaleHeadRight from "@/public/assets/placeholders/female-head-right.svg";
import femaleMouth from "@/public/assets/placeholders/female-mouth.svg";
import femaleHair from "@/public/assets/placeholders/female-scalp.svg";
import maleBodyBack from "@/public/assets/placeholders/male-body-back.svg";
import maleBodyFront from "@/public/assets/placeholders/male-body-front.svg";
import maleBodyLeft from "@/public/assets/placeholders/male-body-left.svg";
import maleBodyRight from "@/public/assets/placeholders/male-body-right.svg";
import maleHeadFront from "@/public/assets/placeholders/male-head-front.svg";
import maleHeadLeft from "@/public/assets/placeholders/male-head-left.svg";
import maleHeadRight from "@/public/assets/placeholders/male-head-right.svg";
import maleMouth from "@/public/assets/placeholders/male-mouth.svg";
import maleHair from "@/public/assets/placeholders/male-scalp.svg";
import { PositionEnum } from "@/types/global";

export const placeholders: {
  sex: string[];
  part?: PartEnum;
  position?: PositionEnum;
  url: StaticImageData;
}[] = [
  {
    sex: ["male"],
    part: PartEnum.FACE,
    position: PositionEnum.FRONT,
    url: maleHeadFront,
  },
  {
    sex: ["male"],
    part: PartEnum.FACE,
    position: PositionEnum.RIGHT,
    url: maleHeadRight,
  },
  {
    sex: ["male"],
    part: PartEnum.FACE,
    position: PositionEnum.LEFT,
    url: maleHeadLeft,
  },
  {
    sex: ["male"],
    part: PartEnum.HAIR,
    position: PositionEnum.FRONT,
    url: maleHair,
  },
  {
    sex: ["male"],
    part: PartEnum.MOUTH,
    position: PositionEnum.FRONT,
    url: maleMouth,
  },
  {
    sex: ["male"],
    part: PartEnum.BODY,
    position: PositionEnum.FRONT,
    url: maleBodyFront,
  },
  {
    sex: ["male"],
    part: PartEnum.BODY,
    position: PositionEnum.RIGHT,
    url: maleBodyRight,
  },
  {
    sex: ["male"],
    part: PartEnum.BODY,
    position: PositionEnum.LEFT,
    url: maleBodyLeft,
  },
  {
    sex: ["male"],
    part: PartEnum.BODY,
    position: PositionEnum.BACK,
    url: maleBodyBack,
  },
  {
    sex: ["female"],
    part: PartEnum.FACE,
    position: PositionEnum.FRONT,
    url: femaleHeadFront,
  },
  {
    sex: ["female"],
    part: PartEnum.FACE,
    position: PositionEnum.RIGHT,
    url: femaleHeadRight,
  },
  {
    sex: ["female"],
    part: PartEnum.FACE,
    position: PositionEnum.LEFT,
    url: femaleHeadLeft,
  },
  {
    sex: ["female"],
    part: PartEnum.HAIR,
    position: PositionEnum.FRONT,
    url: femaleHair,
  },
  {
    sex: ["female"],
    part: PartEnum.MOUTH,
    position: PositionEnum.FRONT,
    url: femaleMouth,
  },
  {
    sex: ["female"],
    part: PartEnum.BODY,
    position: PositionEnum.FRONT,
    url: femaleBodyFront,
  },
  {
    sex: ["female"],
    part: PartEnum.BODY,
    position: PositionEnum.RIGHT,
    url: femaleBodyRight,
  },
  {
    sex: ["female"],
    part: PartEnum.BODY,
    position: PositionEnum.LEFT,
    url: femaleBodyLeft,
  },
  {
    sex: ["female"],
    part: PartEnum.BODY,
    position: PositionEnum.BACK,
    url: femaleBodyBack,
  },
];
