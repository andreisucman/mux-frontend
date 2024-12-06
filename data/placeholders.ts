import femaleHeadFront from "@/public/assets/placeholders/female-head-front.svg";
import femaleHeadLeft from "@/public/assets/placeholders/female-head-left.svg";
import femaleHeadRight from "@/public/assets/placeholders/female-head-right.svg";
import femaleMouth from "@/public/assets/placeholders/female-mouth.svg";
import femaleScalp from "@/public/assets/placeholders/female-scalp.svg";
import femaleStyleHead from "@/public/assets/placeholders/female-style-head.svg";
import femaleBodyBack from "@/public/assets/placeholders/female-body-back.svg";
import femaleBodyFront from "@/public/assets/placeholders/female-body-front.svg";
import femaleBodyLeft from "@/public/assets/placeholders/female-body-left.svg";
import femaleBodyRight from "@/public/assets/placeholders/female-body-right.svg";
import femaleStyleBody from "@/public/assets/placeholders/female-style-body.svg";
import food from "@/public/assets/placeholders/food-black.svg";
import maleHeadFront from "@/public/assets/placeholders/male-head-front.svg";
import maleHeadLeft from "@/public/assets/placeholders/male-head-left.svg";
import maleHeadRight from "@/public/assets/placeholders/male-head-right.svg";
import maleStyleHead from "@/public/assets/placeholders/male-style-head.svg";
import maleMouth from "@/public/assets/placeholders/male-mouth.svg";
import maleScalp from "@/public/assets/placeholders/male-scalp.svg";
import maleBodyFront from "@/public/assets/placeholders/male-body-front.svg";
import maleBodyBack from "@/public/assets/placeholders/male-body-back.svg";
import maleBodyLeft from "@/public/assets/placeholders/male-body-left.svg";
import maleBodyRight from "@/public/assets/placeholders/male-body-right.svg";
import maleStyleBody from "@/public/assets/placeholders/male-style-body.svg";

export const placeholders = [
  { sex: ["male"], type: "head", position: "front", url: maleHeadFront },
  { sex: ["male"], type: "head", position: "right", url: maleHeadRight },
  { sex: ["male"], type: "head", position: "left", url: maleHeadLeft },
  { sex: ["male"], type: "head", position: "scalp", url: maleScalp },
  { sex: ["male"], type: "head", position: "mouth", url: maleMouth },
  { sex: ["male"], type: "style", position: "head", url: maleStyleHead },
  { sex: ["male"], type: "style", position: "body", url: maleStyleBody },
  { sex: ["male"], type: "body", position: "front", url: maleBodyFront },
  { sex: ["male"], type: "body", position: "right", url: maleBodyRight },
  { sex: ["male"], type: "body", position: "left", url: maleBodyLeft },
  { sex: ["male"], type: "body", position: "back", url: maleBodyBack },
  { sex: ["female"], type: "head", position: "front", url: femaleHeadFront },
  { sex: ["female"], type: "head", position: "right", url: femaleHeadRight },
  { sex: ["female"], type: "style", position: "head", url: femaleStyleHead },
  { sex: ["female"], type: "style", position: "body", url: femaleStyleBody },
  { sex: ["female"], type: "head", position: "left", url: femaleHeadLeft },
  { sex: ["female"], type: "head", position: "scalp", url: femaleScalp },
  { sex: ["female"], type: "head", position: "mouth", url: femaleMouth },
  { sex: ["female"], type: "body", position: "front", url: femaleBodyFront },
  { sex: ["female"], type: "body", position: "right", url: femaleBodyRight },
  { sex: ["female"], type: "body", position: "left", url: femaleBodyLeft },
  { sex: ["female"], type: "body", position: "back", url: femaleBodyBack },
  { sex: ["male", "female"], type: "food", position: "front", url: food },
];
