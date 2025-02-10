import { useMemo } from "react";
import { RequirementType } from "@/components/UploadContainer/types";
import { NextActionType } from "@/types/global";
import { getAvailableRequirements } from "./getAvailableRequirements";

type Props = {
  nextScan?: NextActionType[];
  requiredProgress?: RequirementType[];
};

function useCheckScanAvailability({ nextScan, requiredProgress }: Props) {
  const currentRequirements = useMemo(
    () =>
      getAvailableRequirements({
        nextScan,
        requiredProgress,
      }),
    [nextScan, requiredProgress]
  );

  const checkBackDate =
    nextScan && nextScan.length
      ? Math.min(...nextScan.map((r) => (r.date ? new Date(r.date).getTime() : Infinity)))
      : null;

  return { currentRequirements, checkBackDate };
}

export default useCheckScanAvailability;
