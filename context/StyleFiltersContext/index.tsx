"use client";

import React, { createContext, useState } from "react";

const defaultProgressFiltersContext = {
  ethnicity: "",
  setEthnicity: (args: any) => {},
  ageInterval: "",
  setAgeInterval: (args: any) => {},
  sex: "",
  setSex: (args: any) => {},
  type: "",
  setType: (args: any) => {},
  verdict: "",
  setVerdict: (args: any) => {},
};

export const StyleFiltersContext = createContext(defaultProgressFiltersContext);

export default function StyleFiltersContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sex, setSex] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [ageInterval, setAgeInterval] = useState("");
  const [verdict, setVerdict] = useState("");
  const [type, setType] = useState("");

  return (
    <StyleFiltersContext.Provider
      value={{
        ethnicity,
        setEthnicity,
        verdict,
        setVerdict,
        ageInterval,
        setAgeInterval,
        sex,
        setSex,
        type,
        setType,
      }}
    >
      {children}
    </StyleFiltersContext.Provider>
  );
}
