import React, { useEffect } from "react";
import { upperFirst } from "@mantine/hooks";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { PurchaseOverlayDataType } from "@/types/global";

type Props = {
  purchaseOverlayData?: PurchaseOverlayDataType[] | null;
  userName: string | null;
  setConcerns: React.Dispatch<React.SetStateAction<FilterItemType[]>>;
  setParts: React.Dispatch<React.SetStateAction<FilterItemType[]>>;
};

export default function useGetAvailablePartsAndConcerns({
  purchaseOverlayData,
  userName,
  setConcerns,
  setParts,
}: Props) {
  useEffect(() => {
    if (!purchaseOverlayData || !userName) return;
    const availableConcerns = purchaseOverlayData.map((obj) => obj.concern);
    setConcerns(availableConcerns.map((c) => ({ value: c, label: upperFirst(c) })));

    const availableParts = purchaseOverlayData.map((obj) => obj.part);
    setParts(availableParts.map((p) => ({ value: p, label: upperFirst(p) })));
  }, [userName, purchaseOverlayData]);

  return null;
}
