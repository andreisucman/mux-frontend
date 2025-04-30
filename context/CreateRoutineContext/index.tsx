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
    if (!nextRoutine || isLoading) return;
    const partsScanned = Object.entries(latestProgressImages || {})
      .filter(([key, value]) => Boolean(value))
      .map(([key, _]) => key);
    if (partsScanned.length > 1) {
      const relevantRoutines = nextRoutine.filter((obj) => partsScanned.includes(obj.part));
      if (relevantRoutines) openSelectRoutineType(relevantRoutines);
    } else if (partsScanned.length === 1) {
      setIsLoading(true);
      router.push(`/suggest/select-concerns?part=${partsScanned[0]}`);
      modals.closeAll();
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
