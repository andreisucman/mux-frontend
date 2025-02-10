"use client";

import React, { createContext, useEffect, useState } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";

const defaultUploadPartsChoices = {
  parts: [] as string[],
  setParts: (parts: string[]) => {},
};

export const ScanPartsChoicesContext = createContext(defaultUploadPartsChoices);

export default function ScanPartsChoicesProvider({ children }: { children: React.ReactNode }) {
  const [parts, setParts] = useState(["face", "mouth", "scalp", "body"]);

  useEffect(() => {
    const savedScanParts: { [key: string]: any } | null = getFromLocalStorage("scanParts");

    if (savedScanParts) {
      setParts(savedScanParts as string[]);
    }
  }, []);

  const handleSetParts = (parts: string[]) => {
    setParts(parts);
    saveToLocalStorage("scanParts", parts);
  };

  return (
    <ScanPartsChoicesContext.Provider
      value={{
        parts,
        setParts: handleSetParts,
      }}
    >
      {children}
    </ScanPartsChoicesContext.Provider>
  );
}
