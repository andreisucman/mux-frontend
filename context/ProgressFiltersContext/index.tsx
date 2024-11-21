"use client";

import React, { createContext, useState } from "react";

const defaultProgressFiltersContext = {
  ethnicity: "",
  setEthnicity: (args: any) => {},
  ageInterval: "",
  setAgeInterval: (args: any) => {},
  bodyType: "",
  setBodyType: (args: any) => {},
  sex: "",
  setSex: (args: any) => {},
  type: "",
  setType: (args: any) => {},
  part: "",
  setPart: (args: any) => {},
  concern: "",
  setConcern: (args: any) => {},
};

export const ProgressFiltersContext = createContext(defaultProgressFiltersContext);

export default function ProgressFiltersContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sex, setSex] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [ageInterval, setAgeInterval] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [type, setType] = useState("");
  const [part, setPart] = useState("");
  const [concern, setConcern] = useState("");

  return (
    <ProgressFiltersContext.Provider
      value={{
        ethnicity,
        setEthnicity,
        bodyType,
        setBodyType,
        ageInterval,
        setAgeInterval,
        sex,
        setSex,
        type,
        setType,
        part,
        setPart,
        concern,
        setConcern,
      }}
    >
      {children}
    </ProgressFiltersContext.Provider>
  );
}
