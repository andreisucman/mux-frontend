import { RequirementType } from "@/components/UploadContainer/types";
import { NextActionType } from "@/types/global";
import { formatDate } from "./formatDate";
import { parseScanDate } from "./utils";

type Props = {
  parts?: string[];
  nextScan?: NextActionType[];
  requiredProgress?: RequirementType[];
};

function useCheckScanAvailability({ parts, nextScan, requiredProgress }: Props) {
  let result: {
    availableRequirements: RequirementType[] | undefined;
    checkBackDate: string | null;
  } = {
    availableRequirements: undefined,
    checkBackDate: formatDate({ date: new Date(), addTime: true }),
  };

  if (!requiredProgress || !nextScan || !parts) return result;

  result.availableRequirements = [...requiredProgress].filter((po) => parts.includes(po.part));

  if (result.availableRequirements.length === 0) return result;

  const availableParts = nextScan.filter((part) => {
    const partDate = parseScanDate(part);
    if (partDate) {
      return partDate < new Date();
    } else {
      return !partDate;
    }
  });

  const availablePartsKeys = availableParts.map((p) => p.part);

  result.availableRequirements = result.availableRequirements.filter((tr) =>
    availablePartsKeys.includes(tr.part)
  );
  const date = Math.min(...nextScan.map((r) => (r.date ? new Date(r.date).getTime() : Infinity)));

  result.checkBackDate = formatDate({ date: new Date(date || Infinity), addTime: true });

  return result;
}

export default useCheckScanAvailability;
