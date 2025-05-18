"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import callTheServer from "@/functions/callTheServer";
import { PartEnum } from "@/types/global";
import { UserContext } from "../UserContext";
import { AuthStateEnum } from "../UserContext/types";
import { RoutineSuggestionType } from "./types";

const defaultCreateRoutineContext = {
  routineSuggestion: null as RoutineSuggestionType | null,
  setRoutineSuggestion: (args: any) => {},
  fetchRoutineSuggestion: async () => {},
};

export const CreateRoutineSuggestionContext = createContext(defaultCreateRoutineContext);

export default function CreateRoutineProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const { status } = useContext(UserContext);
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
    if (status !== AuthStateEnum.AUTHENTICATED) return;
    fetchRoutineSuggestion();
  }, [status]);

  return (
    <CreateRoutineSuggestionContext.Provider
      value={{
        routineSuggestion,
        setRoutineSuggestion,
        fetchRoutineSuggestion,
      }}
    >
      {children}
    </CreateRoutineSuggestionContext.Provider>
  );
}
