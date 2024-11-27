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
  styleName: "",
  setStyleName: (args: any) => {},
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
  const [styleName, setStyleName] = useState("");
  const [type, setType] = useState("");

  return (
    <StyleFiltersContext.Provider
      value={{
        ethnicity,
        setEthnicity,
        styleName,
        setStyleName,
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
