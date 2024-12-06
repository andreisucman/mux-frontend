import { useMemo } from "react";
import { RequirementType } from "@/components/UploadCarousel/types";
import { NextActionType } from "@/types/global";
import { getAvailableRequirements } from "./getAvailableRequirements";
import { parseScanDate } from "./utils";

type Props = {
  scanType: "head" | "body" | "style";
  nextScan?: NextActionType[];
  requiredProgress?: {
    head: RequirementType[];
    body: RequirementType[];
  };
};

function useCheckScanAvailability({ scanType, nextScan, requiredProgress }: Props) {
  const currentNextScan = useMemo(
    () => nextScan?.find((obj) => obj.type === scanType),
    [scanType, typeof nextScan]
  );

  const currentNextScanDate = useMemo(() => parseScanDate(currentNextScan), [currentNextScan]);

  const currentRequirements = useMemo(
    () =>
      getAvailableRequirements({
        type: scanType,
        typeNextScan: currentNextScan,
        requiredProgress,
      }),
    [scanType, currentNextScan, requiredProgress]
  );

  const needsScan = useMemo(
    () =>
      !currentNextScanDate || (currentNextScanDate && new Date(currentNextScanDate) < new Date()),
    [currentNextScanDate]
  );

  return {
    needsScan,
    availableRequirements: currentRequirements,
    nextScanDate: currentNextScanDate,
  };
}

export default useCheckScanAvailability;
