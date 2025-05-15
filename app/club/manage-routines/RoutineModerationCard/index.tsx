import React, { useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Group,
  NumberInput,
  rem,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import TextareaComponent from "@/components/TextAreaComponent";
import { UserContext } from "@/context/UserContext";
import askConfirmation from "@/helpers/askConfirmation";
import { normalizeString } from "@/helpers/utils";
import { RoutineDataType } from "../page";
import classes from "./RoutineModerationCard.module.css";

type Props = {
  name: string;
  status: string;
  description: string;
  concern: string;
  part: string;
  defaultRoutineData: RoutineDataType;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  saveRoutineData: (
    obj: RoutineDataType,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
  ) => Promise<void>;
};

const statuses = [
  { value: "public", label: "Public" },
  { value: "hidden", label: "Hidden" },
];

export default function RoutineModerationCard({
  concern,
  part,
  name,
  status,
  description,
  defaultRoutineData,
  saveRoutineData,
  setName,
  setDescription,
  setStatus,
}: Props) {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ [key: string]: any }>();
  const label = normalizeString(concern);

  const handleDo = (setter: any, value: any, maxLength?: number) => {
    if (maxLength) {
      if (value.length <= maxLength) {
        setter(value);
      }
    } else {
      setter(value);
    }
    setError(undefined);
  };

  const handleRedirect = useCallback(() => {
    const { name } = userDetails || {};
    router.push(`/club/routines/${name}?concern=${concern}`);
  }, [userDetails, concern]);

  const handleSave = () => {
    if (isLoading) return;

    const save = async () =>
      saveRoutineData(
        {
          concern,
          name,
          part,
          description,
          status: status || "hidden",
        },
        setIsLoading,
        setError
      );

    let body = "";

    const isSwitchingToPublic = defaultRoutineData.status !== "public" && status === "public";
    const isSwitchingToHidden = defaultRoutineData.status !== "hidden" && status === "hidden";
    const concernName = normalizeString(concern).toLowerCase();

    if (isSwitchingToPublic) {
      body = `This will make your ${concernName} related routines and their progress, diary, and proofs public. Continue?`;
    } else if (isSwitchingToHidden) {
      body = `If you have any subscribers for your ${concernName} routines their subscriptions will be canceled. Continue?`;
    }

    if (isSwitchingToHidden || isSwitchingToPublic) {
      askConfirmation({
        title: "Confirm action",
        body,
        onConfirm: () => save(),
      });
    } else {
      save();
    }
  };

  const isSaved = useMemo(() => {
    return (
      status === defaultRoutineData.status &&
      name.trim() === defaultRoutineData.name.trim() &&
      description.trim() === defaultRoutineData.description.trim() 
    );
  }, [name, status, description, defaultRoutineData]);

  return (
    <Stack className={classes.container}>
      <Title order={5} className={classes.title}>
        {label} routines
      </Title>
      <Alert p="0.5rem 1rem">
        This info will appear on your routines sale card. It should help the buyers understand if
        you routines are a good fit for them.
      </Alert>
      <TextInput
        placeholder="The name for your routines"
        value={name}
        label={
          <Group justify="space-between" align="center">
            <Text className={classes.label}>Name</Text>
            <Text size="sm" c="dimmed" mr={16}>
              {50 - name.length}
            </Text>
          </Group>
        }
        styles={{ label: { width: "100%" } }}
        onChange={(e) => handleDo(setName, e.currentTarget.value, 50)}
        error={error?.name}
      />
      <TextareaComponent
        setText={(value) => handleDo(setDescription, value, 2000)}
        text={description}
        customStyles={{ gap: rem(4), minHeight: rem(300) }}
        heading={
          <Group justify="space-between" align="center">
            <Text className={classes.label}>Description</Text>
            <Text size="sm" c="dimmed" mr={16}>
              {2000 - description.length}
            </Text>
          </Group>
        }
        placeholder="What is unique about your routines"
        error={error?.description}
        editable
      />
      <Group className={classes.footer}>
        <Select
          label={<Text className={classes.label}>Status</Text>}
          flex={1}
          data={statuses}
          value={status}
          onChange={(value) => handleDo(setStatus, value)}
          allowDeselect={false}
          miw={100}
        />
        <Group className={classes.buttons}>
          <Button
            variant="default"
            className={classes.button}
            onClick={handleRedirect}
            disabled={defaultRoutineData?.status === "hidden" || isLoading}
          >
            View
          </Button>
          <Button
            className={classes.button}
            loading={isLoading}
            disabled={isSaved || isLoading}
            onClick={handleSave}
          >
            Save
          </Button>
        </Group>
      </Group>
    </Stack>
  );
}
