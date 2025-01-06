"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IconLink } from "@tabler/icons-react";
import { ActionIcon, Group, Rating, rem, Stack, Text } from "@mantine/core";
import { SuggestionType } from "@/types/global";
import { TableSelection } from "./TableSelection";

type Props = {
  item: SuggestionType;
  allItems: SuggestionType[];
};

export default function ProductModalBody({ item, allItems }: Props) {
  const [selectedItem, setSelectedItem] = useState(item);

  const compareItems = allItems.filter((i) => i.suggestion === item.suggestion);
  const sortedItems = compareItems.sort((a, b) => a.rank - b.rank);

  return (
    <Stack>
      <Stack gap={rem(8)}>
        <Group wrap="nowrap">
          <Image
            src={selectedItem.image}
            alt={selectedItem.name}
            width={50}
            height={50}
            style={{ borderRadius: rem(100), objectFit: "cover" }}
          />
          <Stack gap={4}>
            <Text component="div">{selectedItem.name}</Text>
            <Group wrap="nowrap" gap={rem(8)}>
              <Rating size={16} defaultValue={Math.round(selectedItem.rating)} />
              <Text size="sm">({selectedItem.rating})</Text>
            </Group>
          </Stack>
          <ActionIcon
            variant="default"
            component="a"
            href={`${selectedItem.url}&AssociateTag=${process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID}`}
          >
            <IconLink className="icon icon__small" />
          </ActionIcon>
        </Group>
        <Text>{selectedItem.reasoning}</Text>
      </Stack>

      <TableSelection suggestions={sortedItems} handleAlternativeClick={setSelectedItem} />
    </Stack>
  );
}
