"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IconCircleCheck, IconLink } from "@tabler/icons-react";
import cn from "classnames";
import { Button, Checkbox, Group, Rating, rem, Stack, Text, Title } from "@mantine/core";
import { upperFirst, useScrollIntoView } from "@mantine/hooks";
import { addToAmazonCart } from "@/helpers/addToAmazonCart";
import { SuggestionType } from "@/types/global";
import HorizontalScrollRow from "./HorizontalScrollRow";
import classes from "./ProuctModalBody.module.css";

type Props = {
  defaultItem: SuggestionType;
  items: SuggestionType[];
  disableAtc?: boolean;
};

export default function ProductModalBody({ items, defaultItem, disableAtc }: Props) {
  const [selectedCategory, setSelectedCategory] = useState(defaultItem.suggestion);
  const [selectedItem, setSelectedItem] = useState(defaultItem);
  const [selectedProducts, setSelectedProducts] = useState<SuggestionType[]>([]);
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >({ axis: "x", duration: 500 });

  const categoryButtons = [...new Set(items.map((i) => i.suggestion))].map((category) => (
    <Button
      size="compact-sm"
      variant="default"
      className={cn({ [classes.selected]: selectedCategory === category })}
      key={category}
      onClick={() => {
        setSelectedCategory(category);
        if (category !== selectedCategory) {
          const selectedCategoryItems = items.filter((i) => i.suggestion === category);
          console.log(selectedCategoryItems);
          setSelectedItem(selectedCategoryItems[0]);
        }
      }}
    >
      {upperFirst(category)}
    </Button>
  ));

  const selectedCategoryItems = items
    .filter((i) => i.suggestion === selectedCategory)
    .map((i, index) => {
      const isSelected = selectedItem._id === i._id;

      return (
        <Stack
          key={index}
          className={cn(classes.selectProductContainer, {
            [classes.selected]: isSelected,
          })}
          onClick={() => setSelectedItem(i)}
          ref={isSelected ? targetRef : undefined}
        >
          <Stack className={classes.selectProductImageWrapper}>
            <Image
              src={i.image}
              width={50}
              height={50}
              alt=""
              unoptimized
              className={classes.selectProductImage}
            />
          </Stack>
          <Text className={classes.selectProductName} lineClamp={1}>
            {i.name}
          </Text>
        </Stack>
      );
    });

  useEffect(() => {
    scrollIntoView();
  }, [selectedCategory]);

  const addedProducts = selectedProducts.map((p) => (
    <Stack
      className={classes.addedProductContainer}
      key={p._id}
      onClick={() => {
        setSelectedItem(p);
        setSelectedCategory(p.suggestion);
      }}
    >
      <Image
        src={p.image}
        width={50}
        height={50}
        alt=""
        unoptimized
        className={classes.addedProductImage}
      />
    </Stack>
  ));

  const handleAddToCard = (product: SuggestionType) => {
    const isAddedToCart = selectedProducts.map((p) => p._id).includes(product._id);
    setSelectedProducts((prev) => {
      return isAddedToCart ? prev.filter((a) => a._id !== product._id) : [...prev, product];
    });
  };

  const isAddedToCart = selectedProducts.map((p) => p._id).includes(selectedItem._id);
  const selectedAsinsLength = selectedProducts.length;

  return (
    <Stack>
      {categoryButtons.length > 1 && <HorizontalScrollRow children={categoryButtons} />}
      {selectedCategoryItems.length > 1 && (
        <HorizontalScrollRow children={selectedCategoryItems} ref={scrollableRef} />
      )}
      <Stack className={classes.selectedItemStack}>
        <Stack gap={4}>
          <Title order={5} component="div" lineClamp={2}>
            {selectedItem.name}
          </Title>
          <Group wrap="nowrap" gap={rem(8)}>
            <Rating size={16} defaultValue={Math.round(selectedItem.rating || 0)} />
            <Text size="sm">({selectedItem.rating})</Text>
          </Group>
        </Stack>
        {selectedItem && <Text>{selectedItem.intro}</Text>}
        {!disableAtc && (
          <Button
            className={classes.atcButton}
            variant="default"
            onClick={() => handleAddToCard(selectedItem)}
          >
            <Checkbox checked={!!isAddedToCart} readOnly mr={8} />
            {isAddedToCart ? "Select" : "Deselect"}
          </Button>
        )}
      </Stack>

      {selectedItem.productFeatures.length > 0 && (
        <Stack className={classes.content}>
          <Text size="sm" c="dimmed">
            Features:
          </Text>
          <Stack className={cn(classes.featuresStack, { scrollbar: true })}>
            {selectedItem.productFeatures.map((feature, index) => (
              <Group key={index} className={classes.featureRow}>
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
      {addedProducts.length > 0 && <HorizontalScrollRow children={addedProducts} />}
      {!disableAtc && (
        <Button
          onClick={() => addToAmazonCart(selectedProducts.map((p) => p.asin))}
          disabled={!selectedAsinsLength}
        >
          <IconLink className="icon icon__small" style={{ marginRight: rem(8) }} />
          Add to Amazon cart {selectedAsinsLength > 0 ? `(${selectedAsinsLength})` : undefined}
        </Button>
      )}
    </Stack>
  );
}
