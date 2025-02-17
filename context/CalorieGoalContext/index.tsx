"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import { UserContext } from "../UserContext";
import { CalorieGoalTypeEnum } from "./types";

const defaultCalorieGoal = {
  calorieGoal: 0,
  setCalorieGoal: (number: number) => {},
  calorieGoalType: CalorieGoalTypeEnum.PORTION,
  setCalorieGoalType: (choice: CalorieGoalTypeEnum) => {},
};

export const CalorieGoalContext = createContext(defaultCalorieGoal);

export default function CalorieGoalProvider({ children }: { children: React.ReactNode }) {
  const { userDetails } = useContext(UserContext);
  const { nutrition: userNutrition } = userDetails || {};
  const { remainingDailyCalories } = userNutrition || {};

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
    } else {
      setCalorieGoalLocal(remainingDailyCalories || 0);
    }
  }, [calorieGoalTypeLocal]);

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
