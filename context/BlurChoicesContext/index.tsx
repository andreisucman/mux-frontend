"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";

const defaultBlurChoices = {
  blurType: "original",
  setBlurType: (choice: "eyes" | "face" | "original") => {},
};

export const BlurChoicesContext = createContext(defaultBlurChoices);

export default function BlurChoicesProvider({ children }: { children: React.ReactNode }) {
  const [blurType, setBlurTypeLocal] = useState<"eyes" | "face" | "original">("original");

  const setBlurType = useCallback((choice: "eyes" | "face" | "original") => {
    saveToLocalStorage("blurChoice", choice);
    setBlurTypeLocal(choice);
  }, []);

  useEffect(() => {
    const blurChoice = getFromLocalStorage("blurChoice");

    if (blurChoice) {
      setBlurType(blurChoice as "eyes" | "face" | "original");
    }
  }, []);

  return (
    <BlurChoicesContext.Provider
      value={{
        blurType,
        setBlurType,
      }}
    >
      {children}
    </BlurChoicesContext.Provider>
  );
}
