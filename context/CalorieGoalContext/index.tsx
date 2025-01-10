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
  const [calorieGoalTypeLocal, setCalorieGoalTypeLocal] = useState<CalorieGoalTypeEnum>(
    CalorieGoalTypeEnum.PORTION
  );
  const [calorieGoalLocal, setCalorieGoalLocal] = useState<number>(0);

  const { nutrition } = userDetails || {};
  const { remainingDailyCalories = 0 } = nutrition || {};

  const savedNutrition: { [key: string]: any } | null = getFromLocalStorage("nutrition");
  const { calorieGoalType, calorieGoal } = savedNutrition || {};

  const setCalorieGoalType = useCallback((choice: CalorieGoalTypeEnum) => {
    saveToLocalStorage("nutrition", { calorieGoalType: choice }, "add");
    setCalorieGoalTypeLocal(choice);
  }, []);

  useEffect(() => {
    setCalorieGoalTypeLocal(calorieGoalType);

    if (calorieGoalType === CalorieGoalTypeEnum.PORTION) {
      setCalorieGoalLocal(calorieGoal);
    } else {
      setCalorieGoalLocal(remainingDailyCalories);
    }
  }, [calorieGoal, calorieGoalType, remainingDailyCalories]);

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
