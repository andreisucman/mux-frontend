"use client";

import React, { createContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import callTheServer from "@/functions/callTheServer";
import { PartEnum } from "@/types/global";
import { RoutineSuggestionType } from "./types";

const defaultCreateRoutineContext = {
  routineSuggestion: null as RoutineSuggestionType | null,
  setRoutineSuggestion: (args: any) => {},
  fetchRoutineSuggestion: async () => {},
};

export const CreateRoutineContext = createContext(defaultCreateRoutineContext);

export default function CreateRoutineProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [routineSuggestion, setRoutineSuggestion] = useState<RoutineSuggestionType | null>(null);

  const part = searchParams.get("part") || PartEnum.FACE;

  const fetchRoutineSuggestion = async () => {
    const response = await callTheServer({
      endpoint: `getRoutineSuggestion/${part}`,
      method: "GET",
    });
    if (response.status === 200) {
      setRoutineSuggestion(response.message);
    }
  };

  useEffect(() => {
    fetchRoutineSuggestion();
  }, []);

  return (
    <CreateRoutineContext.Provider
      value={{
        routineSuggestion,
        setRoutineSuggestion,
        fetchRoutineSuggestion,
      }}
    >
      {children}
    </CreateRoutineContext.Provider>
  );
}
