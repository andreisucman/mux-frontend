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
import { upperFirst } from "@mantine/hooks";
import TextareaComponent from "@/components/TextAreaComponent";
import { UserContext } from "@/context/UserContext";
import askConfirmation from "@/helpers/askConfirmation";
import { useRouter } from "@/helpers/custom-router";
import { getPartIcon } from "@/helpers/icons";
import { RoutineDataType } from "../page";
import classes from "./RoutineModerationCard.module.css";

type Props = {
  part: string;
  defaultStatus?: string;
  defaultName?: string;
  defaultDescription?: string;
  defaultOneTimePrice?: number;
  defaultUpdatePrice?: number;
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
  part,
  defaultStatus = "hidden",
  saveRoutineData,
  defaultName = "",
  defaultDescription = "",
  defaultOneTimePrice = 1,
  defaultUpdatePrice = 1,
}: Props) {
  const { userDetails } = useContext(UserContext);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ [key: string]: any }>();
  const [name, setName] = useState<string>(defaultName);
  const [status, setStatus] = useState<string | null>(defaultStatus);
  const [description, setDescription] = useState<string>(defaultDescription);
  const [price, setOneTimePrice] = useState<number>(defaultOneTimePrice);
  const [updatePrice, setSubscriptionPrice] = useState<number>(defaultUpdatePrice);

  const icon = getPartIcon(part);
  const label = upperFirst(part);

  const handleDo = (
    setter: React.Dispatch<React.SetStateAction<any>>,
    value: any,
    maxLength?: number
  ) => {
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
    router.push(`/club/routines/${name}?part=${part}`);
  }, [userDetails, part]);

  const isSaved = useMemo(() => {
    return (
      status === defaultStatus &&
      name === defaultName &&
      description === defaultDescription &&
      price === defaultOneTimePrice &&
      updatePrice === defaultUpdatePrice
    );
  }, [
    name,
    status,
    description,
    price,
    updatePrice,
    defaultStatus,
    defaultName,
    defaultDescription,
    defaultOneTimePrice,
    defaultUpdatePrice,
  ]);

  const handleSave = () => {
    if (isLoading) return;

    const save = async () =>
      saveRoutineData(
        {
          part,
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

    if (defaultStatus !== "public" && status === "public") {
      body = `This will make your ${part} progress, routines, diary, and proof public. Continue?`;
    } else {
      body = `If you have any subscribers, their subscription renewals will be canceled. Continue?`;
    }

    askConfirmation({
      title: "Confirm action",
      body,
      onConfirm: () => save(),
    });
  };

  return (
    <Stack className={classes.container}>
      <Title order={5} className={classes.title}>
        {icon} {label} routine
      </Title>
      <TextInput
        placeholder="The name of your routine"
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
        setText={(value) => handleDo(setDescription, value, 150)}
        text={description}
        customStyles={{ gap: rem(4) }}
        heading={
          <Group justify="space-between" align="center">
            <Text className={classes.label}>Description</Text>
            <Text size="sm" c="dimmed" mr={16}>
              {150 - description.length}
            </Text>
          </Group>
        }
        placeholder="What is unique about your routine"
        error={error?.description}
        editable
      />
      <Group className={classes.footer}>
        <Group wrap="nowrap">
          <NumberInput
            label={<Text className={classes.label}>One-time price</Text>}
            defaultValue={price}
            onChange={(value) => handleDo(setOneTimePrice, Number(value))}
            clampBehavior="strict"
            min={1}
            max={10000}
            allowNegative={false}
            error={error?.price}
          />
          <NumberInput
            defaultValue={updatePrice}
            label={<Text className={classes.label}>Price of update</Text>}
            onChange={(value) => handleDo(setSubscriptionPrice, Number(value))}
            clampBehavior="strict"
            min={1}
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
            disabled={defaultStatus === "hidden" || isLoading}
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
