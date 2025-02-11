import { PartEnum } from "@/context/ScanPartsChoicesContext/types";
import { PositionEnum, TypeEnum } from "@/types/global";

export type RequirementType = {
  title: string;
  instruction: string;
  type: TypeEnum;
  part: PartEnum;
  position: PositionEnum;
};
