import { useMemo } from "react";
import Timer from "@/components/Timer";
import { ProgressRequirementType } from "@/components/UploadCarousel/types";
import { NextActionType } from "@/types/global";
import { formatDate } from "./formatDate";
import { getAvailableRequirements } from "./getAvailableRequirements";
import { daysFrom, parseScanDate } from "./utils";

type Props = {
  scanType: "head" | "body" | "style";
  nextScan?: NextActionType[];
  requiredProgress?: {
    head: ProgressRequirementType[] | null;
    body: ProgressRequirementType[] | null;
    health: ProgressRequirementType[] | null;
  };
};

function useCheckScanAvailability({ scanType, nextScan, requiredProgress }: Props) {
  const oneDayFromNow = daysFrom({ days: 1 });

  const currentNextScan = useMemo(
    () => nextScan?.find((obj) => obj.type === scanType),
    [scanType, typeof nextScan]
  );

  const currentNextScanDate = useMemo(() => parseScanDate(currentNextScan), [currentNextScan]);

  const isAfterOneDay = useMemo(
    () => currentNextScanDate && currentNextScanDate > oneDayFromNow,
    [currentNextScanDate, oneDayFromNow]
  );

  const currentRequirements = useMemo(
    () =>
      getAvailableRequirements({
        type: scanType,
        typeNextScan: currentNextScan,
        requiredProgress,
      }),
    [scanType, currentNextScan, requiredProgress]
  );

  const needsScan = useMemo(() => currentRequirements.length > 0, [currentRequirements]);

  const overlayChildren = useMemo(
    () =>
      needsScan ? undefined : isAfterOneDay ? (
        formatDate({ date: currentNextScanDate, hideYear: true })
      ) : (
        <Timer date={currentNextScanDate} />
      ),
    [needsScan, isAfterOneDay, currentNextScanDate]
  );

  return {
    needsScan,
    availableRequirements: currentRequirements,
    nextScanDate: currentNextScanDate,
    overlayChildren,
  };
}

export default useCheckScanAvailability;
