import React, { useMemo, useState } from "react";
import { Button, Group, Skeleton, Text } from "@mantine/core";
import { getPartIcon } from "@/helpers/icons";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { normalizeString } from "@/helpers/utils";
import { RoutineDataType } from "../page";
import classes from "./RoutineDataRow.module.css";

type Props = {
  defaultRoutine: RoutineDataType;
  changeStatus: (
    newStatus: "public" | "hidden",
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
  changeMonetization: (
    newMonetization: "enabled" | "disabled",
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
};

export default function RoutineDataRow({
  defaultRoutine,
  changeStatus,
  changeMonetization,
}: Props) {
  const showSkeleton = useShowSkeleton();
  const [isLoading, setIsLoading] = useState(false);

  const partIcon = getPartIcon(defaultRoutine.part, 18);
  const concern = normalizeString(defaultRoutine.concern);
  const partName = normalizeString(defaultRoutine.part);

  const handleUpdate = (type: "status" | "monetization") => {
    switch (type) {
      case "status":
        const newStatus: "public" | "hidden" =
          defaultRoutine.status === "public" ? "hidden" : "public";
        changeStatus(newStatus, isLoading, setIsLoading);
        break;
      case "monetization":
        const newMonetization = defaultRoutine.monetization === "enabled" ? "disabled" : "enabled";
        changeMonetization(newMonetization, isLoading, setIsLoading);
        break;
    }
  };

  const buttonsData = useMemo(() => {
    const statusText = defaultRoutine.status === "public" ? "Public" : "Publish";
    const monetizeText = defaultRoutine.monetization === "enabled" ? "Monetized" : "Monetize";
    const statusColor = defaultRoutine.status === "public" ? "green.7" : undefined;
    const monetizationColor = defaultRoutine.monetization === "enabled" ? "green.7" : undefined;
    return { statusText, monetizeText, statusColor, monetizationColor };
  }, [defaultRoutine]);

  return (
    <Skeleton visible={showSkeleton}>
      <Group className={classes.container}>
        <Group gap={8}>
          {partIcon}
          {partName}
          <Text component="span">-</Text>
          <Text component="span">{normalizeString(concern).toLowerCase()}</Text>
        </Group>
        <Group gap={12} ml="auto">
          <Button
            variant={"default"}
            c={buttonsData.statusColor}
            size="compact-sm"
            onClick={() => handleUpdate("status")}
          >
            {buttonsData.statusText}
          </Button>
          <Button
            variant={"default"}
            c={buttonsData.monetizationColor}
            size="compact-sm"
            onClick={() => handleUpdate("monetization")}
          >
            {buttonsData.monetizeText}
          </Button>
        </Group>
      </Group>
    </Skeleton>
  );
}
