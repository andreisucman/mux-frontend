import { RequirementType } from "@/components/UploadContainer/types";
import { PartEnum } from "@/context/ScanPartsChoicesContext/types";
import { NextActionType } from "@/types/global";
import { parseScanDate } from "./utils";

type Props = {
  requiredProgress?: RequirementType[];
  nextScan?: NextActionType[];
};

export function getAvailableRequirements({ requiredProgress, nextScan }: Props) {
  let available = requiredProgress;
  if (nextScan && nextScan.length > 0) {
    const availableParts = nextScan.filter((part) => {
      const partDate = parseScanDate(part);
      if (partDate) {
        return partDate < new Date();
      } else {
        return !partDate;
      }
    });

    const availablePartsKeys = availableParts.map((p) => p.part);

    if (requiredProgress) {
      available = [...requiredProgress].filter((tr) =>
        availablePartsKeys.includes(tr.part as PartEnum)
      );
    }
  }

  return available;
}
