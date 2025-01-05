"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IconArrowLeft, IconLink, IconVersions } from "@tabler/icons-react";
import { ActionIcon, Button, Group, Rating, rem, Stack, Text, Title } from "@mantine/core";
import { SuggestionType } from "@/types/global";
import { TableSelection } from "./TableSelection";
import classes from "./ProductModalBody.module.css";

type Props = {
  item: SuggestionType;
  allItems: SuggestionType[];
};

export default function ProductModalBody({ item, allItems }: Props) {
  const { name, image, reasoning } = item;
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(item);

  const compareItems = allItems.filter((i) => i.suggestion === item.suggestion);

  const icon = showAlternatives ? (
    <IconArrowLeft className={"icon"} style={{ marginRight: rem(6) }} />
  ) : (
    <IconVersions className={"icon"} style={{ marginRight: rem(6) }} />
  );

  return (
    <Stack className={classes.container}>
      {showAlternatives ? (
        <>
          <Stack gap={rem(8)}>
            <Group wrap="nowrap">
              <Image
                src={selectedSuggestion.image}
                alt={selectedSuggestion.name}
                width={50}
                height={50}
                style={{ borderRadius: rem(100), objectFit: "cover" }}
              />
              <Stack gap={4}>
                <Text component="div">{selectedSuggestion.name}</Text>
                <Group wrap="nowrap" gap={rem(8)}>
                  <Rating
                    size={16}
                    defaultValue={Math.round(selectedSuggestion.rating)}
                    className={classes.rating}
                  />
                  <Text size="sm">({selectedSuggestion.rating})</Text>
                </Group>
              </Stack>
              <ActionIcon
                variant="default"
                component="a"
                href={`${selectedSuggestion.url}&AssociateTag=${process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID}`}
              >
                <IconLink className="icon icon__small" />
              </ActionIcon>
            </Group>
            <Text>{selectedSuggestion.reasoning}</Text>
          </Stack>

          <TableSelection
            suggestions={compareItems.sort((a, b) => a.rank - b.rank)}
            handleAlternativeClick={setSelectedSuggestion}
          />
        </>
      ) : (
        <>
          <div className={classes.imageWrapper}>
            <Image
              width={100}
              height={100}
              alt={name || ""}
              src={image}
              className={classes.image}
            />
          </div>
          <Stack className={classes.titleGroup}>
            <Group wrap="nowrap">
              <Title order={4} fw={600}>
                {name}
              </Title>
              <ActionIcon
                variant="default"
                onClick={() =>
                  (window.location.href = `${item.url}&AssociateTag=${process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID}`)
                }
              >
                <IconLink className="icon icon__small" />
              </ActionIcon>
            </Group>
            <Group className={classes.ratingWrapper}>
              <Rating
                size={20}
                defaultValue={Math.round(selectedSuggestion.rating)}
                className={classes.rating}
              />
              <Text>({selectedSuggestion.rating})</Text>
            </Group>
          </Stack>
          <Text>{reasoning}</Text>
        </>
      )}

      <Button
        variant="default"
        onClick={() => {
          setShowAlternatives((prev) => !prev);
          setSelectedSuggestion(item);
        }}
        className={classes.button}
      >
        {showAlternatives ? "Return" : "Comparison"}
      </Button>
    </Stack>
  );
}
