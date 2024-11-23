import { TypeEnum } from "@/types/global";
import { PartEnum } from "@/context/UploadPartsChoicesContext/types";

export type ProgressRequirementType = {
  title: string;
  instruction: string;
  type: TypeEnum;
  part: PartEnum;
  position: "front" | "back" | "right" | "left" | "mouth" | "scalp";
};
