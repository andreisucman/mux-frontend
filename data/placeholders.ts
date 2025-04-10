import { StaticImageData } from "next/image";
import femaleHeadFront from "@/public/assets/placeholders/female-head-front.svg";
import femaleHair from "@/public/assets/placeholders/female-scalp.svg";
import maleHeadFront from "@/public/assets/placeholders/male-head-front.svg";
import maleHair from "@/public/assets/placeholders/male-scalp.svg";
import { PartEnum } from "@/types/global";

export const placeholders: {
  sex: string[];
  part?: PartEnum;
  url: StaticImageData;
}[] = [
  {
    sex: ["male"],
    part: PartEnum.FACE,
    url: maleHeadFront,
  },
  {
    sex: ["male"],
    part: PartEnum.HAIR,
    url: maleHair,
  },
  {
    sex: ["female"],
    part: PartEnum.FACE,
    url: femaleHeadFront,
  },
  {
    sex: ["female"],
    part: PartEnum.HAIR,
    url: femaleHair,
  },
];
