import { PartEnum } from "@/context/UploadPartsChoicesContext/types";
import { TypeEnum } from "@/types/global";

export type ProgressRequirementType = {
  title: string;
  instruction: string;
  type: TypeEnum;
  part: PartEnum;
  position: "front" | "back" | "right" | "left" | "mouth" | "scalp";
};
