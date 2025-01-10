import React, { useCallback, useContext, useMemo } from "react";
import { Group, SegmentedControl, Slider, Stack, Text } from "@mantine/core";
import { CalorieGoalContext } from "@/context/CalorieGoalContext";
import { CalorieGoalTypeEnum } from "@/context/CalorieGoalContext/types";
import { UserContext } from "@/context/UserContext";
import { saveToLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import classes from "./CalorieGoal.module.css";

type Props = {
  disabled: boolean;
};

export default function CalorieGoalController({ disabled }: Props) {
  const { status, userDetails } = useContext(UserContext);
  const { calorieGoal, calorieGoalType, setCalorieGoal, setCalorieGoalType } =
    useContext(CalorieGoalContext);

  const segments = useMemo(() => {
    let data = [
      { label: "Per portion", value: "portion" },
      { label: "Remaining today", value: "remaining" },
    ];
    return data;
  }, [status]);

  const { nutrition } = userDetails || {};
  const { remainingDailyCalories = 0 } = nutrition || {};

  const handleChangeSlider = useCallback(
    (calorieGoal: number) => {
      if (calorieGoalType === CalorieGoalTypeEnum.REMAINING) {
        setCalorieGoal(remainingDailyCalories);
        return;
      }
      setCalorieGoal(calorieGoal);
      saveToLocalStorage("nutrition", { calorieGoal }, "add");
    },
    [calorieGoalType, remainingDailyCalories]
  );

  const handleChangeGoal = useCallback(
    (value: string) => {
      if (value === CalorieGoalTypeEnum.PORTION) {
        setCalorieGoalType(CalorieGoalTypeEnum.PORTION);
        return;
      }

      if (status !== "authenticated") {
        openErrorModal({ description: "You need to Sign in to see your estimated calorie norm." });
        return;
      }

      setCalorieGoalType(CalorieGoalTypeEnum.REMAINING);
      setCalorieGoal(remainingDailyCalories || 0);
    },
    [status, remainingDailyCalories]
  );

  return (
    <Stack className={classes.container}>
      <Group className={classes.titleGroup}>
        <Text className={classes.title} c={"dimmed"}>
          Calorie limit
        </Text>
        <SegmentedControl
          disabled={disabled}
          size="xs"
          data={segments}
          value={calorieGoalType}
          onChange={handleChangeGoal}
          styles={{ root: { zIndex: 1 } }}
        />
      </Group>
      <Slider
        min={0}
        max={5000}
        step={100}
        value={calorieGoal}
        onChangeEnd={handleChangeSlider}
        classNames={{ label: classes.label, thumb: classes.thumb }}
        disabled={disabled}
        labelAlwaysOn
      />
    </Stack>
  );
}
