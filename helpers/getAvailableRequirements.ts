import { RequirementType } from "@/components/UploadCarousel/types";
import { PartEnum } from "@/context/UploadPartsChoicesContext/types";
import { NextActionType, TypeEnum } from "@/types/global";
import { parseScanDate } from "./utils";

type Props = {
  requiredProgress?: {
    head: RequirementType[] | null;
    body: RequirementType[] | null;
    health: RequirementType[] | null;
  } | null;
  typeNextScan?: NextActionType;
  type: string;
};

export function getAvailableRequirements({ requiredProgress, typeNextScan, type }: Props) {
  const typeRequirements = requiredProgress?.[type as TypeEnum] || [];

  let requirements: RequirementType[] = typeRequirements;

  if (typeNextScan && typeNextScan.parts.length > 0) {
    const availableParts = typeNextScan.parts.filter((part) => {
      const partDate = parseScanDate(part);
      if (partDate) {
        return partDate < new Date();
      } else {
        return !partDate;
      }
    });

    const availablePartsKeys = availableParts.map((p) => p.part);

    requirements = typeRequirements.filter((tr) =>
      availablePartsKeys.includes(tr.part as PartEnum)
    );
  }

  return requirements;
}
