"use client";

import React from "react";
import Image from "next/image";
import { IconCircleCheck, IconLink } from "@tabler/icons-react";
import { Button, Group, Rating, rem, Stack, Text } from "@mantine/core";
import { SuggestionType } from "@/types/global";
import classes from "./ProuctModalBody.module.css";

type Props = {
  item: SuggestionType;
};

export default function ProductModalBody({ item }: Props) {
  return (
    <Stack>
      <Stack gap={rem(8)}>
        <Group wrap="nowrap">
          <Image
            src={item.image}
            alt={item.name}
            width={100}
            height={100}
            style={{ borderRadius: rem(100), objectFit: "cover" }}
          />
          <Stack gap={4}>
            <Text component="div">{item.name}</Text>
            <Group wrap="nowrap" gap={rem(8)}>
              <Rating size={16} defaultValue={Math.round(item.rating)} />
              <Text size="sm">({item.rating})</Text>
            </Group>
          </Stack>
        </Group>
        <Text>{item.reasoning}</Text>
      </Stack>

      {item.productFeatures.length > 0 && (
        <Stack className={classes.content}>
          <Text size="sm" c="dimmed">
            Features:
          </Text>
          <Stack className={classes.contentWrapper}>
            {item.productFeatures.map((feature, index) => (
              <Group key={index} align="center" wrap="nowrap">
                <IconCircleCheck
                  className="icon"
                  color="var(--mantine-color-green-7)"
                  style={{ minWidth: rem(24) }}
                />
                {feature}
              </Group>
            ))}
          </Stack>
        </Stack>
      )}
      <Button
        component="a"
        c="white"
        href={`${item.url}&AssociateTag=${process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID}`}
      >
        <IconLink className="icon icon__small" style={{ marginRight: rem(8) }} />
        Buy from Amazon
      </Button>
    </Stack>
  );
}
