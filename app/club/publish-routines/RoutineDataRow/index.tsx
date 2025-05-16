import React, { useState } from "react";
import { Group, Skeleton, Switch, Text } from "@mantine/core";
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

  return (
    <Skeleton visible={showSkeleton}>
      <Group className={classes.container}>
        <Group gap={8}>
          {partIcon}
          {partName}
          <Text component="span">-</Text>
          <Text component="span">{normalizeString(concern).toLowerCase()}</Text>
        </Group>

        <Switch
          checked={defaultRoutine.status === "public"}
          onChange={() => handleUpdate("status")}
          label="Public"
        />
        <Switch
          checked={defaultRoutine.monetization === "enabled"}
          onChange={() => handleUpdate("monetization")}
          label="Monetize"
        />
      </Group>
    </Skeleton>
  );
}
