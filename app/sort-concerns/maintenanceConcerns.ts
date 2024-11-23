import { PartEnum } from "@/context/UploadPartsChoicesContext/types";
import { TypeEnum } from "@/types/global";

export const maintenanceConcerns = [
  {
    name: "face_maintenance",
    type: "head" as TypeEnum,
    explanation: "",
    importance: 1,
    isDisabled: false,
    part: "face" as PartEnum,
    imported: false,
  },
  {
    name: "oral_maintenance",
    type: "head" as TypeEnum,
    explanation: "",
    importance: 1,
    isDisabled: false,
    part: "mouth" as PartEnum,
    imported: false,
  },
  {
    name: "scalp_maintenance",
    type: "head" as TypeEnum,
    explanation: "",
    importance: 1,
    isDisabled: false,
    part: "scalp" as PartEnum,
    imported: false,
  },
  {
    name: "fitness_maintenance",
    type: "body" as TypeEnum,
    explanation: "",
    importance: 1,
    isDisabled: false,
    part: "body" as PartEnum,
    imported: false,
  },
  {
    name: "health_maintenance",
    type: "health" as TypeEnum,
    explanation: "",
    importance: 1,
    isDisabled: false,
    part: "health" as PartEnum,
    imported: false,
  },
];
