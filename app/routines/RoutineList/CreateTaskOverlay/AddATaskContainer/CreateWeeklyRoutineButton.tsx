import React, { useContext } from "react";
import { IconCalendar } from "@tabler/icons-react";
import { Button, rem } from "@mantine/core";
import { CreateRoutineContext } from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import { TypeEnum } from "@/types/global";

type Props = {
  type: TypeEnum;
};

export default function CreateWeeklyRoutineButton({ type }: Props) {
  const { isSubscriptionActive, isTrialUsed, isLoading, onCreateRoutineClick } =
    useContext(CreateRoutineContext);
  const { userDetails } = useContext(UserContext) || {};
  const { nextScan } = userDetails || {};

  const typeNextScan = nextScan?.find((obj) => obj.type === type);
  const isInCooldown =
    typeNextScan && typeNextScan.date && new Date(typeNextScan.date) > new Date();

  return (
    <Button
      loading={isLoading}
      disabled={!!isInCooldown}
      onClick={() => onCreateRoutineClick(isSubscriptionActive, isTrialUsed)}
    >
      <IconCalendar className="icon" style={{ marginRight: rem(8) }} /> Create weekly routine
    </Button>
  );
}
