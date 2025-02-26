import React, { useCallback, useContext, useEffect, useState } from "react";
import { IconDeviceFloppy, IconRotate } from "@tabler/icons-react";
import { ActionIcon, Group, NumberInput, Skeleton, Stack, Text, Title } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import classes from "./OtherSettings.module.css";

export default function OtherSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [caloriesPerDay, setCaloriesPerDay] = useState(1000);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { nutrition } = userDetails || {};
  const { dailyCalorieGoal, recommendedDailyCalorieGoal } = nutrition || {};

  useEffect(() => {
    setCaloriesPerDay(dailyCalorieGoal || 0);
  }, [dailyCalorieGoal]);

  const updateCalorieGoal = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await callTheServer({
        endpoint: "updateUserData",
        method: "POST",
        body: { dailyCalorieGoal: caloriesPerDay },
      });

      if (response.status === 200) {
        const { message } = response;

        setUserDetails(message);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, caloriesPerDay, userDetails]);

  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton visible={showSkeleton}>
      <Stack className={classes.container}>
        <Title order={2} fz={18}>
          Other
        </Title>
        <Stack className={classes.content}>
          <Text className={classes.title} c="dimmed">
            Daily calorie goal
          </Text>
          <NumberInput
            maw={425}
            value={caloriesPerDay}
            placeholder="Daily calorie goal"
            clampBehavior="strict"
            max={10000}
            min={0}
            onChange={(v) => setCaloriesPerDay(Math.min(Number(v), 10000))}
            rightSectionWidth={72}
            rightSection={
              <Group gap={8}>
                <ActionIcon
                  variant="default"
                  style={{ border: "none" }}
                  disabled={caloriesPerDay === recommendedDailyCalorieGoal || isLoading}
                  onClick={() => setCaloriesPerDay(Number(recommendedDailyCalorieGoal || 0))}
                >
                  <IconRotate className="icon icon__small" />{" "}
                </ActionIcon>
                <ActionIcon
                  loading={isLoading}
                  disabled={caloriesPerDay === dailyCalorieGoal || isLoading}
                  onClick={updateCalorieGoal}
                >
                  <IconDeviceFloppy className="icon icon__small" />{" "}
                </ActionIcon>
              </Group>
            }
          />
        </Stack>
      </Stack>
    </Skeleton>
  );
}
