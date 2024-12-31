import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { IconMedal2 } from "@tabler/icons-react";
import { Button, Group, Progress, rem, Skeleton, Stack, Text, Title } from "@mantine/core";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import { UserContext } from "@/context/UserContext";
import { AuthStateEnum } from "@/context/UserContext/types";
import callTheServer from "@/functions/callTheServer";
import { calculateRewardTaskCompletion } from "@/helpers/calculateRewardTaskCompletion";
import openAuthModal from "@/helpers/openAuthModal";
import openErrorModal from "@/helpers/openErrorModal";
import openSuccessModal from "@/helpers/openSuccessModal";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { StreaksType } from "@/types/global";
import { RewardCardType } from "../types";
import { defaultStreaks } from "./defaultStreaks";
import classes from "./RewardCard.module.css";

type Props = {
  data: RewardCardType;
};

export default function RewardCard({ data }: Props) {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [streaks, setStreaks] = useState<StreaksType>();
  const { status, userDetails } = useContext(UserContext);
  const { left, icon, count, value, title, condition, requisite } = data;
  const { _id: userId } = userDetails || {};

  const redeemed = count - left;

  const completion = useMemo(
    () =>
      calculateRewardTaskCompletion({
        streaks,
        requisite,
      }),
    [typeof streaks, typeof requisite]
  );

  const handleClaimReward = useCallback(
    async (rewardId: string) => {
      if (isLoading) return;
      setIsLoading(true);

      if (status !== AuthStateEnum.AUTHENTICATED) {
        openAuthModal({
          title: "Sign in",
          stateObject: {
            referrer: ReferrerEnum.REWARDS,
            localUserId: userId,
            redirectPath: "/rewards",
          },
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await callTheServer({
          endpoint: "claimReward",
          method: "POST",
          body: { rewardId },
        });

        if (response.status === 200) {
          if (response.error) {
            openErrorModal({
              description: response.error,
            });
            return;
          }
          openSuccessModal({ description: response.message });
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, status, userId]
  );

  useEffect(() => {
    if (status === "authenticated") {
      const { streaks } = userDetails || {};
      if (streaks) setStreaks(streaks);
    } else {
      setStreaks(defaultStreaks);
    }
  }, [status]);

  useEffect(() => {
    setButtonDisabled(completion?.value !== 100);
  }, [completion]);

  const showSkeleton = useShowSkeleton();

  const finalValue = Math.round(Number(completion?.value)) || 0;

  return (
    <Skeleton visible={showSkeleton} className="skeleton">
      <Stack className={classes.container}>
        <Group className={classes.heading}>
          {value && <Text>${value}</Text>}
          <Title order={5}>{title}</Title>
          <Text>
            ({redeemed}/{count})
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
            onClick={() => handleClaimReward(data._id)}
          >
            <IconMedal2 style={{ marginRight: rem(6) }} />
            Claim the reward
          </Button>
        </Stack>
      </Stack>
    </Skeleton>
  );
}
