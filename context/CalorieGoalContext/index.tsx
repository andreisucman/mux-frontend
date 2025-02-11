"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import { CalorieGoalTypeEnum } from "./types";

const defaultCalorieGoal = {
  calorieGoal: 0,
  setCalorieGoal: (number: number) => {},
  calorieGoalType: CalorieGoalTypeEnum.PORTION,
  setCalorieGoalType: (choice: CalorieGoalTypeEnum) => {},
};

export const CalorieGoalContext = createContext(defaultCalorieGoal);

export default function CalorieGoalProvider({ children }: { children: React.ReactNode }) {
  const [calorieGoalTypeLocal, setCalorieGoalTypeLocal] = useState<CalorieGoalTypeEnum>(
    CalorieGoalTypeEnum.PORTION
  );
  const [calorieGoalLocal, setCalorieGoalLocal] = useState<number>(0);

  useEffect(() => {
    const savedNutrition: { [key: string]: any } | null = getFromLocalStorage("nutrition");
    const { calorieGoalType = CalorieGoalTypeEnum.PORTION, calorieGoal } = savedNutrition || {};

    setCalorieGoalTypeLocal(calorieGoalType);

    if (calorieGoalType === CalorieGoalTypeEnum.PORTION) {
      setCalorieGoalLocal(calorieGoal);
    }
  }, []);

  const setCalorieGoalType = useCallback((choice: CalorieGoalTypeEnum) => {
    saveToLocalStorage("nutrition", { calorieGoalType: choice }, "add");
    setCalorieGoalTypeLocal(choice);
  }, []);

  return (
    <CalorieGoalContext.Provider
      value={{
        calorieGoalType: calorieGoalTypeLocal,
        setCalorieGoalType,
        calorieGoal: calorieGoalLocal,
        setCalorieGoal: setCalorieGoalLocal,
      }}
    >
      {children}
    </CalorieGoalContext.Provider>
  );
}
