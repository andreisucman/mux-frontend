"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import { UserContext } from "../UserContext";
import { CalorieGoalEnum } from "./types";

const defaultCalorieGoal = {
  calorieGoal: 0,
  setCalorieGoal: (number: number) => {},
  calorieGoalType: CalorieGoalEnum.PORTION,
  setCalorieGoalType: (choice: CalorieGoalEnum) => {},
};

export const CalorieGoalContext = createContext(defaultCalorieGoal);

export default function CalorieGoalProvider({ children }: { children: React.ReactNode }) {
  const { userDetails } = useContext(UserContext);
  const [calorieGoalTypeLocal, setCalorieGoalTypeLocal] = useState<CalorieGoalEnum>(
    CalorieGoalEnum.PORTION
  );
  const [calorieGoalLocal, setCalorieGoalLocal] = useState<number>(0);

  const { nutrition } = userDetails || {};
  const { dailyCalorieGoal, remainingDailyCalories = 0 } = nutrition || {};

  const setCalorieGoalType = useCallback((choice: CalorieGoalEnum) => {
    saveToLocalStorage("nutrition", { calorieGoalType: choice }, "add");
    setCalorieGoalTypeLocal(choice);
  }, []);

  useEffect(() => {
    const savedNutrition: { [key: string]: any } | null = getFromLocalStorage("nutrition");

    if (nutrition) {
      const { calorieGoalType } = savedNutrition || {};
      setCalorieGoalTypeLocal(calorieGoalType as CalorieGoalEnum);
    }
  }, []);

  useEffect(() => {
    if (calorieGoalTypeLocal === CalorieGoalEnum.PORTION) return;
    const savedNutrition: { [key: string]: any } | null = getFromLocalStorage("nutrition");

    if (savedNutrition) {
      const { calorieGoalLocal } = savedNutrition || {};
      const value =
        calorieGoalLocal > remainingDailyCalories ? remainingDailyCalories : calorieGoalLocal;
      setCalorieGoalLocal(value);
    }
  }, [dailyCalorieGoal, remainingDailyCalories, calorieGoalTypeLocal]);

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
