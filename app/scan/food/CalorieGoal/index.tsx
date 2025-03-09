import React, { useCallback, useContext, useMemo, useState } from "react";
import { Group, SegmentedControl, Slider, Stack, Text, Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { CalorieGoalContext } from "@/context/CalorieGoalContext";
import { CalorieGoalTypeEnum } from "@/context/CalorieGoalContext/types";
import { UserContext } from "@/context/UserContext";
import openErrorModal from "@/helpers/openErrorModal";
import classes from "./CalorieGoal.module.css";

type Props = {
  disabled: boolean;
};

export default function CalorieGoalController({ disabled }: Props) {
  const [openTooltip, setOpenTooltip] = useState(false);
  const clickOutsideRef = useClickOutside(() => setOpenTooltip(false));
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
        setCalorieGoal(remainingDailyCalories || 0);
        return;
      } else {
        setCalorieGoal(calorieGoal);
      }
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
        max={4000}
        step={100}
        value={calorieGoal}
        onChange={handleChangeSlider}
        classNames={{ label: classes.label, thumb: classes.thumb }}
        disabled={disabled}
        thumbChildren={
          <Tooltip
            opened={openTooltip}
            disabled={calorieGoalType === CalorieGoalTypeEnum.PORTION}
            label="Daily calorie goal can be changed in the settings"
            ref={clickOutsideRef}
            onClick={() => setOpenTooltip((prev) => !prev)}
          >
            {
              <Text fw={600} fz={14}>
                {calorieGoal || "0"}
              </Text>
            }
          </Tooltip>
        }
      />
    </Stack>
  );
}
