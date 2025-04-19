import React, { useEffect } from "react";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { normalizeString } from "@/helpers/utils";
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

    const availableConcerns = Array.from(new Set(purchaseOverlayData.map((obj) => obj.concern)));
    setConcerns(
      availableConcerns
        .map((c) => ({ value: c || "", label: normalizeString(c || "") }))
        .filter((r) => r.value)
    );

    const availableParts = Array.from(new Set(purchaseOverlayData.map((obj) => obj.part)));
    setParts(
      availableParts
        .map((p) => ({ value: p || "", label: normalizeString(p || "") }))
        .filter((r) => r.value)
    );
  }, [userName, purchaseOverlayData]);

  return null;
}
