import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Group, Progress, Skeleton, Stack, Text, Title } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import checkRewardCompletion from "@/helpers/checkRewardCompletion";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { ClaimRewardProps } from "../page";
import { RewardCardType } from "../types";
import classes from "./RewardCard.module.css";

type Props = {
  data: RewardCardType;
  claimReward: (props: ClaimRewardProps) => Promise<void>;
};

export default function RewardCard({ data, claimReward }: Props) {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails } = useContext(UserContext);
  const { left, icon, count, value, title, condition, requisite } = data;

  const completion = useMemo(() => {
    if (!userDetails) return 0;
    return checkRewardCompletion(requisite, userDetails);
  }, [requisite, userDetails]);

  useEffect(() => {
    setButtonDisabled(Number(completion) < 100);
  }, [completion]);

  const showSkeleton = useShowSkeleton();

  const finalValue = Math.round(Number(completion) > 100 ? 100 : Number(completion)) || 0;

  return (
    <Skeleton visible={showSkeleton} className="skeleton">
      <Stack className={classes.container}>
        <Group className={classes.heading}>
          {value && <Text>${value}</Text>}
          <Title order={5}>{title}</Title>
          <Text>
            ({left}/{count})
          </Text>
        </Group>
        <Stack className={classes.content}>
          <Text>{condition}</Text>
          <Group className={classes.row}>
            {icon}
            <Progress.Root size={20} className={classes.progressRoot}>
              <Progress.Section value={finalValue} color={"var(--mantine-color-green-9)"}>
                <Progress.Label>{finalValue}%</Progress.Label>
              </Progress.Section>
            </Progress.Root>
          </Group>
          <Button
            disabled={buttonDisabled || isLoading}
            loading={isLoading}
            onClick={() => claimReward({ rewardId: data._id, isLoading, setIsLoading })}
          >
            Claim the reward
          </Button>
        </Stack>
      </Stack>
    </Skeleton>
  );
}
