import femaleBack from "@/public/assets/placeholders/female-back.svg";
import femaleHeadFront from "@/public/assets/placeholders/female-head-front.svg";
import femaleHeadLeft from "@/public/assets/placeholders/female-head-left.svg";
import femaleHeadRight from "@/public/assets/placeholders/female-head-right.svg";
import femaleHeadStyle from "@/public/assets/placeholders/female-head-style.svg";
import femaleFront from "@/public/assets/placeholders/female-front.svg";
import femaleLeft from "@/public/assets/placeholders/female-left.svg";
import femaleMouth from "@/public/assets/placeholders/female-mouth.svg";
import femaleRight from "@/public/assets/placeholders/female-right.svg";
import femaleScalp from "@/public/assets/placeholders/female-scalp.svg";
import femaleStyle from "@/public/assets/placeholders/female-style.svg";
import food from "@/public/assets/placeholders/food.svg";
import maleBack from "@/public/assets/placeholders/male-back.svg";
import maleHeadFront from "@/public/assets/placeholders/male-head-front.svg";
import maleHeadLeft from "@/public/assets/placeholders/male-head-left.svg";
import maleHeadRight from "@/public/assets/placeholders/male-head-right.svg";
import maleHeadStyle from "@/public/assets/placeholders/male-head-style.svg";
import maleFront from "@/public/assets/placeholders/male-front.svg";
import maleLeft from "@/public/assets/placeholders/male-left.svg";
import maleMouth from "@/public/assets/placeholders/male-mouth.svg";
import maleRight from "@/public/assets/placeholders/male-right.svg";
import maleScalp from "@/public/assets/placeholders/male-scalp.svg";
import maleStyle from "@/public/assets/placeholders/male-style.svg";

export const placeholders = [
  { sex: ["male"], type: "head", position: "front", url: maleHeadFront },
  { sex: ["male"], type: "head", position: "right", url: maleHeadRight },
  { sex: ["male"], type: "head", position: "left", url: maleHeadLeft },
  { sex: ["male"], type: "head", position: "scalp", url: maleScalp },
  { sex: ["male"], type: "head", position: "mouth", url: maleMouth },
  { sex: ["male"], type: "style", position: "head", url: maleHeadStyle },
  { sex: ["male"], type: "style", position: "body", url: maleStyle },
  { sex: ["male"], type: "body", position: "front", url: maleFront },
  { sex: ["male"], type: "body", position: "right", url: maleRight },
  { sex: ["male"], type: "body", position: "left", url: maleLeft },
  { sex: ["male"], type: "body", position: "back", url: maleBack },
  { sex: ["female"], type: "head", position: "front", url: femaleHeadFront },
  { sex: ["female"], type: "head", position: "right", url: femaleHeadRight },
  { sex: ["female"], type: "style", position: "head", url: femaleHeadStyle },
  { sex: ["female"], type: "style", position: "body", url: femaleStyle },
  { sex: ["female"], type: "head", position: "left", url: femaleHeadLeft },
  { sex: ["female"], type: "head", position: "scalp", url: femaleScalp },
  { sex: ["female"], type: "head", position: "mouth", url: femaleMouth },
  { sex: ["female"], type: "body", position: "front", url: femaleFront },
  { sex: ["female"], type: "body", position: "right", url: femaleRight },
  { sex: ["female"], type: "body", position: "left", url: femaleLeft },
  { sex: ["female"], type: "body", position: "back", url: femaleBack },
  { sex: ["male", "female"], type: "food", position: "front", url: food },
];
