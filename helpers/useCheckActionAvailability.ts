import { NextActionType } from "@/types/global";
import { formatDate } from "./formatDate";
import { parseScanDate } from "./utils";

type Props = {
  part?: string | null;
  nextAction?: NextActionType[];
};

function useCheckActionAvailability({ part, nextAction }: Props) {
  let result: {
    isActionAvailable: boolean;
    checkBackDate: string | null;
  } = {
    isActionAvailable: false,
    checkBackDate: formatDate({ date: new Date() }),
  };

  if (!nextAction || !part) return result;

  const availableParts = nextAction.find((p) => p.part === part);

  const partDate = parseScanDate(availableParts);

  if (partDate) {
    result.checkBackDate = partDate.toDateString();
    result.isActionAvailable = partDate < new Date();
  } else {
    result.isActionAvailable = true;
  }

  return result;
}

export default useCheckActionAvailability;
