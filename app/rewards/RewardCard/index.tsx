import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { IconMedal2 } from "@tabler/icons-react";
import { Group, Progress, rem, Skeleton, Stack, Text, Title } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { calculateRewardTaskCompletion } from "@/helpers/calculateRewardTaskCompletion";
import { useRouter } from "@/helpers/custom-router";
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
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [streaks, setStreaks] = useState<StreaksType>();
  const { status, userDetails } = useContext(UserContext);
  const { left, icon, count, value, title, condition, requisite } = data;

  const redeemed = count - left;

  const completion = useMemo(
    () =>
      calculateRewardTaskCompletion({
        streaks,
        requisite,
      }),
    [typeof streaks, typeof requisite]
  );

  const handleClaimReward = useCallback(async (rewardId: string) => {
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
    }
  }, []);

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
          <GlowingButton
            text="Claim the reward"
            disabled={buttonDisabled}
            icon={<IconMedal2 style={{ marginRight: rem(6) }} />}
            onClick={status === "authenticated" ? handleClaimReward : () => router.push("/auth")}
          />
        </Stack>
      </Stack>
    </Skeleton>
  );
}
