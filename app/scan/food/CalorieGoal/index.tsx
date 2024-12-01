import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { Group, SegmentedControl, Slider, Stack, Text } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
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
  const { remainingCaloriesPerDay } = userDetails || {};

  const segments = useMemo(() => {
    let data = [
      { label: "Per portion", value: "portion" },
      { label: "Remaining today", value: "remaining", disabled: true },
    ];
    if (status === "authenticated") {
      data = data.map((item) => (item.value === "remaining" ? { ...item, disabled: false } : item));
    }
    return data;
  }, [status]);

  const handleChangeSlider = useCallback(
    (calorieGoal: number) => {
      if (goalType === "remaining") return;
      setCalorieGoal(calorieGoal);
    },
    [goalType]
  );

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!remainingCaloriesPerDay) return;

    setCalorieGoal(remainingCaloriesPerDay);
  }, [status, remainingCaloriesPerDay]);

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
          onChange={setGoalType}
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
