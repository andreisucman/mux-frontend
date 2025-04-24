import { StaticImageData } from "next/image";
import femaleBodyDark from "@/public/assets/placeholders/female-body-dark.svg";
import femaleBodyLight from "@/public/assets/placeholders/female-body-light.svg";
import femaleHeadFrontLight from "@/public/assets/placeholders/female-head-front-light.svg";
import femaleHeadFront from "@/public/assets/placeholders/female-head-front.svg";
import femaleHairLight from "@/public/assets/placeholders/female-hair-light.svg";
import femaleHairDark from "@/public/assets/placeholders/female-hair-dark.svg";
import maleBodyDark from "@/public/assets/placeholders/male-body-dark.svg";
import maleBodyLight from "@/public/assets/placeholders/male-body-light.svg";
import maleHeadFrontLight from "@/public/assets/placeholders/male-head-front-light.svg";
import maleHeadFront from "@/public/assets/placeholders/male-head-front.svg";
import maleHairLight from "@/public/assets/placeholders/male-scalp-light.svg";
import maleHair from "@/public/assets/placeholders/male-scalp.svg";
import { PartEnum } from "@/types/global";

export const placeholders: {
  sex: string[];
  part?: PartEnum;
  url: StaticImageData;
  scheme: "dark" | "light";
}[] = [
  {
    sex: ["male"],
    part: PartEnum.FACE,
    url: maleHeadFront,
    scheme: "dark",
  },
  {
    sex: ["male"],
    part: PartEnum.HAIR,
    url: maleHair,
    scheme: "dark",
  },
  {
    sex: ["male"],
    part: PartEnum.FACE,
    url: maleHeadFrontLight,
    scheme: "light",
  },
  {
    sex: ["male"],
    part: PartEnum.HAIR,
    url: maleHairLight,
    scheme: "light",
  },
  {
    sex: ["male"],
    part: PartEnum.BODY,
    url: maleBodyDark,
    scheme: "dark",
  },
  {
    sex: ["male"],
    part: PartEnum.BODY,
    url: maleBodyLight,
    scheme: "light",
  },
  {
    sex: ["female"],
    part: PartEnum.FACE,
    url: femaleHeadFront,
    scheme: "dark",
  },
  {
    sex: ["female"],
    part: PartEnum.HAIR,
    url: femaleHairDark,
    scheme: "dark",
  },
  {
    sex: ["female"],
    part: PartEnum.FACE,
    url: femaleHeadFrontLight,
    scheme: "light",
  },
  {
    sex: ["female"],
    part: PartEnum.HAIR,
    url: femaleHairLight,
    scheme: "light",
  },
  {
    sex: ["female"],
    part: PartEnum.BODY,
    url: femaleBodyLight,
    scheme: "light",
  },
  {
    sex: ["female"],
    part: PartEnum.BODY,
    url: femaleBodyDark,
    scheme: "dark",
  },
];
