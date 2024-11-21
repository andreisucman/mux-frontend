"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";

const defaultUploadPartsChoices = {
  showFace: true,
  showMouth: true,
  showScalp: true,
  setShowPart: (type: "face" | "mouth" | "scalp", value: boolean) => {},
};

export const UploadPartsChoicesContext = createContext(defaultUploadPartsChoices);

export default function UploadPartsChoicesProvider({ children }: { children: React.ReactNode }) {
  const [showFace, setShowFace] = useState(true);
  const [showMouth, setShowMouth] = useState(true);
  const [showScalp, setShowScalp] = useState(true);

  const setShowPart = useCallback((type: "face" | "mouth" | "scalp", value: boolean) => {
    saveToLocalStorage("uploadPartsChoices", { [type]: value }, "add");

    if (type === "face") setShowFace(value);
    if (type === "mouth") setShowMouth(value);
    if (type === "scalp") setShowScalp(value);
  }, []);

  useEffect(() => {
    const uploadPartsChoices: { [key: string]: any } | null =
      getFromLocalStorage("uploadPartsChoices");

    if (uploadPartsChoices) {
      const faceValue =
        uploadPartsChoices["face"] === undefined ? true : uploadPartsChoices["face"];
      const mouthValue =
        uploadPartsChoices["mouth"] === undefined ? true : uploadPartsChoices["mouth"];
      const scalpValue =
        uploadPartsChoices["scalp"] === undefined ? true : uploadPartsChoices["scalp"];

      setShowFace(faceValue);
      setShowMouth(mouthValue);
      setShowScalp(scalpValue);
    }
  }, []);

  return (
    <UploadPartsChoicesContext.Provider
      value={{
        showFace,
        showMouth,
        showScalp,
        setShowPart,
      }}
    >
      {children}
    </UploadPartsChoicesContext.Provider>
  );
}
