import React, { useCallback, useContext, useMemo } from "react";
import { Group, SegmentedControl, Slider, Stack, Text } from "@mantine/core";
import { CalorieGoalContext } from "@/context/CalorieGoalContext";
import { CalorieGoalEnum } from "@/context/CalorieGoalContext/types";
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

  const handleChangeSlider = useCallback(
    (calorieGoal: number) => {
      if (calorieGoalType === "remaining") return;
      setCalorieGoal(calorieGoal);
      saveToLocalStorage("calorieGoal", calorieGoal);
    },
    [calorieGoalType]
  );

  const handleChangeGoal = useCallback(
    (value: string) => {
      if (value === CalorieGoalEnum.PORTION) {
        setCalorieGoalType(CalorieGoalEnum.PORTION);
        return;
      }

      if (status !== "authenticated") {
        openErrorModal({ description: "You need to login to see your estimated calorie norm." });
        return;
      }
      const { nutrition } = userDetails || {};

      setCalorieGoalType(CalorieGoalEnum.REMAINING);
      setCalorieGoal(nutrition?.remainingDailyCalories || 0);
    },
    [status, userDetails]
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
        onChange={handleChangeSlider}
        classNames={{ label: classes.label, thumb: classes.thumb }}
        disabled={disabled}
        labelAlwaysOn
      />
    </Stack>
  );
}
