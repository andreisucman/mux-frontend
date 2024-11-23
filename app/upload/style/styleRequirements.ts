import { TypeEnum } from "@/types/global";
import { PartEnum } from "@/context/UploadPartsChoicesContext/types";
import { PositionEnum } from "@/app/upload/types";

export const styleRequirements = {
  head: [
    {
      type: "head" as TypeEnum,
      part: "face" as PartEnum,
      position: "front" as PositionEnum,
      title: "Style scan: Head",
      instruction: "Upload a photo of your head how you usually style it",
    },
  ],
  body: [
    {
      type: "body" as TypeEnum,
      part: "body" as PartEnum,
      position: "front" as PositionEnum,
      title: "Style scan: Outfit",
      instruction: "Upload a photo of yourself in your usual outfit",
    },
  ],
};
