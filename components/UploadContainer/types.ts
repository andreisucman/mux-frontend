import { PartEnum } from "@/context/ScanPartsChoicesContext/types";
import { PositionEnum } from "@/types/global";

export type RequirementType = {
  title: string;
  instruction: string;
  part: PartEnum;
  position: PositionEnum;
};
