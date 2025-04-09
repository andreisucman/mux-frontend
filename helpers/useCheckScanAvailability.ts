import { NextActionType } from "@/types/global";
import { formatDate } from "./formatDate";
import { parseScanDate } from "./utils";

type Props = {
  part?: string | null;
  nextScan?: NextActionType[];
};

function useCheckScanAvailability({ part, nextScan }: Props) {
  let result: {
    isScanAvailable: boolean;
    checkBackDate: string | null;
  } = {
    isScanAvailable: false,
    checkBackDate: formatDate({ date: new Date() }),
  };

  if (!nextScan || !part) return result;

  const availableParts = nextScan.find((p) => p.part === part);

  const partDate = parseScanDate(availableParts);

  if (partDate) {
    result.checkBackDate = partDate.toDateString();
    result.isScanAvailable = partDate < new Date();
  } else {
    result.isScanAvailable = true;
  }

  return result;
}

export default useCheckScanAvailability;
