"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import callTheServer from "@/functions/callTheServer";
import { PartEnum } from "@/types/global";
import { UserContext } from "../UserContext";
import { RoutineSuggestionType } from "./types";

const defaultCreateRoutineContext = {
  routineSuggestion: null as RoutineSuggestionType | null,
  setRoutineSuggestion: (args: any) => {},
  fetchRoutineSuggestion: async (userId?: string) => {},
};

export const CreateRoutineSuggestionContext = createContext(defaultCreateRoutineContext);

export default function CreateRoutineProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const [routineSuggestion, setRoutineSuggestion] = useState<RoutineSuggestionType | null>(null);
  const [pageLoaded, setPageLoaded] = useState(false);

  const { _id: userId } = userDetails || {};

  const part = searchParams.get("part") || PartEnum.FACE;

  const fetchRoutineSuggestion = async (userId?: string) => {
    let endpoint = `getRoutineSuggestion/${part}`;
    if (userId) endpoint += `?userId=${userId}`;
    const response = await callTheServer({
      endpoint,
      method: "GET",
    });

    if (response.status === 200) {
      setRoutineSuggestion(response.message);
    }
  };

  useEffect(() => {
    if (!pageLoaded) return;
    fetchRoutineSuggestion(userId);
  }, [pathname, userId, pageLoaded]);

  useEffect(() => setPageLoaded(true), []);

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
