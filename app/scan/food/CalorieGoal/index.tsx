import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { Group, SegmentedControl, Slider, Stack, Text } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import classes from "./CalorieGoal.module.css";

type Props = {
  disabled: boolean;
  calorieGoal: number;
  setCalorieGoal: React.Dispatch<React.SetStateAction<number>>;
  goalType: string;
  setGoalType: React.Dispatch<React.SetStateAction<string>>;
};

export default function CalorieGoalController({
  calorieGoal,
  setCalorieGoal,
  goalType,
  setGoalType,
  disabled,
}: Props) {
  const { status, userDetails } = useContext(UserContext);

  const segments = useMemo(() => {
    let data = [
      { label: "Per portion", value: "portion" },
      { label: "Remaining today", value: "remaining" },
    ];
    return data;
  }, [status]);

  const handleChangeSlider = useCallback(
    (calorieGoal: number) => {
      if (goalType === "remaining") return;
      setCalorieGoal(calorieGoal);
      saveToLocalStorage("calorieGoal", calorieGoal);
    },
    [goalType]
  );

  const handleChangeGoal = useCallback(
    (value: string) => {
      if (value === "portion") {
        setGoalType("portion");
        return;
      }

      if (status !== "authenticated") {
        openErrorModal({ description: "You need to login to see your estimated calorie norm." });
        return;
      }
      const { latestProgress, nutrition } = userDetails || {};

      const { body } = latestProgress || {};

      if (body?.overall === 0) {
        openErrorModal({
          description: "You need to scan your body to get your estimated calorie norm.",
        });
        return;
      }

      setGoalType("remaining");
      setCalorieGoal(nutrition?.remainingDailyCalories || 0);
    },
    [status, userDetails]
  );

  useEffect(() => {
    const savedCalorieGoal = getFromLocalStorage("calorieGoal");

    if (savedCalorieGoal) {
      setCalorieGoal(Number(savedCalorieGoal));
    }
  }, []);

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
          value={goalType}
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
