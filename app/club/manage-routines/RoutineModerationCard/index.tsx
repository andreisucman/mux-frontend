import React, { useCallback, useContext, useMemo, useState } from "react";
import {
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
import { useRouter } from "@/helpers/custom-router";
import { normalizeString } from "@/helpers/utils";
import { RoutineDataType } from "../page";
import classes from "./RoutineModerationCard.module.css";

type Props = {
  name: string;
  status: string;
  description: string;
  price: number;
  updatePrice: number;
  concern: string;
  defaultRoutineData: RoutineDataType;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  setUpdatePrice: React.Dispatch<React.SetStateAction<number>>;
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
  name,
  status,
  description,
  price,
  updatePrice,
  defaultRoutineData,
  saveRoutineData,
  setName,
  setDescription,
  setPrice,
  setUpdatePrice,
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
          description,
          status: status || "hidden",
          price,
          updatePrice,
        },
        setIsLoading,
        setError
      );

    let body = "";

    const isSwitchingToPublic = defaultRoutineData.status !== "public" && status === "public";
    const isSwitchingToHidden = defaultRoutineData.status !== "hidden" && status === "hidden";
    const concernName = normalizeString(concern).toLowerCase();

    if (isSwitchingToPublic) {
      body = `This will make your routines related to ${concernName} and their associated progress, diary, and proof public. Continue?`;
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
      description.trim() === defaultRoutineData.description.trim() &&
      price === defaultRoutineData.price &&
      updatePrice === defaultRoutineData.updatePrice
    );
  }, [name, status, description, price, updatePrice, defaultRoutineData]);

  return (
    <Stack className={classes.container}>
      <Title order={5} className={classes.title}>
        {label} routines
      </Title>
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
        <Group wrap="nowrap">
          <NumberInput
            label={<Text className={classes.label}>One-time price</Text>}
            defaultValue={price}
            onChange={(value) => handleDo(setPrice, Number(value))}
            clampBehavior="strict"
            min={5}
            max={10000}
            allowNegative={false}
            error={error?.price}
          />
          <NumberInput
            defaultValue={updatePrice}
            label={<Text className={classes.label}>Price of update</Text>}
            onChange={(value) => handleDo(setUpdatePrice, Number(value))}
            clampBehavior="strict"
            min={2}
            max={10000}
            allowNegative={false}
            rightSection={
              <Text c="dimmed" size="sm">
                / month
              </Text>
            }
            rightSectionWidth={75}
            error={error?.updatePrice}
          />
        </Group>
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
            disabled={defaultRoutineData.status === "hidden" || isLoading}
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
