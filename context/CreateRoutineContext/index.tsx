"use client";

import React, { createContext, useContext, useState } from "react";
import { modals } from "@mantine/modals";
import { useRouter } from "@/helpers/custom-router";
import openSelectRoutineType from "@/helpers/openSelectRoutineType";
import { UserContext } from "../UserContext";

const defaultUploadPartsChoices = {
  isLoading: false,
  onCreateRoutineClick: () => {},
};

export const CreateRoutineContext = createContext(defaultUploadPartsChoices);

export default function CreateRoutineContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const { nextRoutine, latestProgressImages } = userDetails || {};

  const onCreateRoutineClick = () => {
    console.log("line 23", userDetails, isLoading);

    if (!nextRoutine || isLoading) return;
    console.log("line 26");
    const partsScanned = Object.entries(latestProgressImages || {})
      .filter(([key, value]) => Boolean(value))
      .map(([key, _]) => key);
    console.log("line 30");
    if (partsScanned.length > 1) {
      const relevantRoutines = nextRoutine.filter((obj) => partsScanned.includes(obj.part));
      if (relevantRoutines) openSelectRoutineType(relevantRoutines);
      console.log("line 34");
    } else if (partsScanned.length === 1) {
      setIsLoading(true);
      router.push(`/suggest/select-concerns?part=${partsScanned[0]}`);
      modals.closeAll();
      console.log("line 39");
    }
  };

  return (
    <CreateRoutineContext.Provider
      value={{
        isLoading,
        onCreateRoutineClick,
      }}
    >
      {children}
    </CreateRoutineContext.Provider>
  );
}
