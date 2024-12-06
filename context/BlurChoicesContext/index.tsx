"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import { BlurTypeEnum } from "./types";

const defaultBlurChoices = {
  blurType: BlurTypeEnum.ORIGINAL,
  setBlurType: (choice: BlurTypeEnum) => {},
};

export const BlurChoicesContext = createContext(defaultBlurChoices);

export default function BlurChoicesProvider({ children }: { children: React.ReactNode }) {
  const [blurType, setBlurTypeLocal] = useState<BlurTypeEnum>(BlurTypeEnum.ORIGINAL);

  const setBlurType = useCallback((choice: BlurTypeEnum) => {
    saveToLocalStorage("blurChoice", choice);
    setBlurTypeLocal(choice);
  }, []);

  useEffect(() => {
    const blurChoice = getFromLocalStorage("blurChoice");

    if (blurChoice) {
      setBlurType(blurChoice as BlurTypeEnum);
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
