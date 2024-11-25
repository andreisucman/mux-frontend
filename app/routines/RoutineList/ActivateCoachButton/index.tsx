import React, { useContext } from "react";
import { Button, rem } from "@mantine/core";
import { CreateRoutineContext } from "@/context/CreateRoutineContext";

export default function ActivateCoachButton() {
  const { isSubscriptionActive, isTrialUsed, isLoading, onCreateRoutineClick } =
    useContext(CreateRoutineContext);

  const buttonText = isSubscriptionActive ? "Create weekly routine" : "Activate improvement coach";

  return (
    <Button
      size="compact-sm"
      loading={isLoading}
      disabled={isLoading}
      mb={rem(16)}
      onClick={() => onCreateRoutineClick(isSubscriptionActive, isTrialUsed)}
    >
      🤩 {buttonText}
    </Button>
  );
}
