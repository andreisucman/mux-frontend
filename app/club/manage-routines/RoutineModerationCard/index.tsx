import React, { useState } from "react";
import { Button, Group, NumberInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import TextareaComponent from "@/components/TextAreaComponent";
import { getPartIcon } from "@/helpers/icons";
import classes from "./RoutineModerationCard.module.css";

type Props = {
  part: string;
  defaultName: string;
  defaultDescription: string;
  defaultOneTimePrice: number;
  defaultSubscriptionPrice: number;
};

export default function RoutineModerationCard({
  part,
  defaultName,
  defaultDescription,
  defaultOneTimePrice,
  defaultSubscriptionPrice,
}: Props) {
  const [name, setName] = useState<string>(defaultName || "");
  const [description, setDescription] = useState<string>(defaultDescription || "");
  const [oneTimePrice, setOneTimePrice] = useState<number>(defaultOneTimePrice || 0);
  const [subscriptionPrice, setSubscriptionPrice] = useState<number>(defaultSubscriptionPrice || 0);

  const icon = getPartIcon(part);
  const label = upperFirst(part);

  return (
    <Stack className={classes.container}>
      <Title order={5} className={classes.title}>
        {icon} {label} routine
      </Title>
      <TextInput
        placeholder="The name of your routine"
        value={name}
        label={
          <Text className={classes.label}>
            Name
          </Text>
        }
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <TextareaComponent
        setText={setDescription}
        text={description}
        heading={
          <Text className={classes.label}>
            Description
          </Text>
        }
        placeholder="What is unique about your routine"
        editable
      />
      <Group className={classes.footer}>
        <Group className={classes.inputWrapper}>
          <NumberInput
            label={
              <Text className={classes.label}>
                One-time price
              </Text>
            }
            value={oneTimePrice}
            onChange={(value) => setOneTimePrice(Number(value))}
          />
          <NumberInput
            value={subscriptionPrice}
            label={
              <Text className={classes.label}>
                Subscription price
              </Text>
            }
            onChange={(value) => setSubscriptionPrice(Number(value))}
          />
        </Group>
        <Button className={classes.button}>Publish</Button>
      </Group>
    </Stack>
  );
}
