"use client";

import React from "react";
import Image from "next/image";
import { IconCircleCheck, IconLink } from "@tabler/icons-react";
import { ActionIcon, Group, List, Rating, rem, Stack, Text } from "@mantine/core";
import { SuggestionType } from "@/types/global";

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
            width={50}
            height={50}
            style={{ borderRadius: rem(100), objectFit: "cover" }}
          />
          <Stack gap={4}>
            <Text component="div">{item.name}</Text>
            <Group wrap="nowrap" gap={rem(8)}>
              <Rating size={16} defaultValue={Math.round(item.rating)} />
              <Text size="sm">({item.rating})</Text>
            </Group>
          </Stack>
          <ActionIcon
            variant="default"
            component="a"
            href={`${item.url}&AssociateTag=${process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID}`}
          >
            <IconLink className="icon icon__small" />
          </ActionIcon>
        </Group>
        <Text>{item.reasoning}</Text>
      </Stack>

      <List>
        {item.productFeatures.map((feature, index) => (
          <Group key={index} align="center">
            <IconCircleCheck className="icon" color="var(--mantine-color-green-7)" />
            {feature}
          </Group>
        ))}
      </List>
    </Stack>
  );
}
