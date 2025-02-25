"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IconCircleCheck, IconLink } from "@tabler/icons-react";
import cn from "classnames";
import { Button, Checkbox, Group, Rating, rem, Stack, Text, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { addToAmazonCart } from "@/helpers/addToAmazonCart";
import { SuggestionType } from "@/types/global";
import HorizontalScrollRow from "./HorizontalScrollRow";
import classes from "./ProuctModalBody.module.css";

type Props = {
  defaultItem: SuggestionType;
  items: SuggestionType[];
};

export default function ProductModalBody({ items, defaultItem }: Props) {
  const [selectedCategory, setSelectedCategory] = useState(defaultItem.suggestion);
  const [selectedItem, setSelectedItem] = useState(defaultItem);
  const [selectedProducts, setSelectedProducts] = useState<SuggestionType[]>([]);

  const categoryButtons = [...new Set(items.map((i) => i.suggestion))].map((category) => (
    <Button
      size="compact-sm"
      variant="default"
      className={cn({ [classes.selected]: selectedCategory === category })}
      key={category}
      onClick={() => {
        setSelectedCategory(category);
        console.log("category", category, "selectedCategory", selectedCategory);
        if (category !== selectedCategory) {
          const selectedCategoryItems = items.filter((i) => i.suggestion === category);
          console.log(selectedCategoryItems)
          setSelectedItem(selectedCategoryItems[0]);
        }
      }}
    >
      {upperFirst(category)}
    </Button>
  ));

  const selectedCategoryItems = items
    .filter((i) => i.suggestion === selectedCategory)
    .map((i, index) => (
      <Stack
        key={index}
        className={cn(classes.selectProductContainer, {
          [classes.selected]: selectedItem._id === i._id,
        })}
        onClick={() => setSelectedItem(i)}
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
    ));

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

  // useEffect(() => {
  //   const selectedCategoryItems = items.filter((i) => i.suggestion === selectedCategory);
  //   setSelectedItem(selectedCategoryItems[0]);
  // }, [selectedCategory]);

  return (
    <Stack>
      {categoryButtons.length > 1 && <HorizontalScrollRow children={categoryButtons} />}
      {selectedCategoryItems.length > 1 && <HorizontalScrollRow children={selectedCategoryItems} />}
      <Stack className={classes.selectedItemStack}>
        <Stack gap={4}>
          <Title order={5} component="div">
            {selectedItem.name}
          </Title>
          <Group wrap="nowrap" gap={rem(8)}>
            <Rating size={16} defaultValue={Math.round(selectedItem.rating || 0)} />
            <Text size="sm">({selectedItem.rating})</Text>
          </Group>
        </Stack>
        {selectedItem && <Text>{selectedItem.intro}</Text>}
        <Button
          className={classes.atcButton}
          variant="default"
          onClick={() => handleAddToCard(selectedItem)}
        >
          <Checkbox checked={!!isAddedToCart} readOnly mr={8} />
          {isAddedToCart ? "Remove from cart" : "Add to cart"}
        </Button>
      </Stack>

      {selectedItem.productFeatures.length > 0 && (
        <Stack className={classes.content}>
          <Text size="sm" c="dimmed">
            Features:
          </Text>
          <Stack className={classes.contentWrapper}>
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
      <Button
        onClick={() => addToAmazonCart(selectedProducts.map((p) => p.asin))}
        disabled={!selectedAsinsLength}
      >
        <IconLink className="icon icon__small" style={{ marginRight: rem(8) }} />
        Buy selected {selectedAsinsLength > 0 ? `(${selectedAsinsLength})` : undefined}
      </Button>
    </Stack>
  );
}
