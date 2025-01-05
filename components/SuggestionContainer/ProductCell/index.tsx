import React, { useCallback } from "react";
import Image from "next/image";
import { IconShoppingBag } from "@tabler/icons-react";
import { Button, Checkbox, Rating, rem, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import ProductModalBody from "@/components/ProductModalBody";
import { SuggestionType } from "@/types/global";
import classes from "./ProductCell.module.css";

type Props = {
  item: SuggestionType;
  allItems: SuggestionType[];
  showOnCellAtc: boolean;
  selectedAsins?: string[];
  setSelectedAsins?: React.Dispatch<React.SetStateAction<string[]>>;
};

const ProductCell = ({ item, allItems, selectedAsins, showOnCellAtc, setSelectedAsins }: Props) => {
  const added = selectedAsins?.includes(item.asin);
  const modalTitle = `Product preview`;

  const handleAddToCard = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (!setSelectedAsins) return;
      setSelectedAsins((prev) => {
        return added ? prev.filter((a) => a !== item.asin) : [...prev, item.asin];
      });
    },
    [added]
  );

  const openProductModal = useCallback(() => {
    modals.openContextModal({
      centered: true,
      modal: "general",
      title: (
        <Title order={5} component={"p"} lineClamp={1}>
          {modalTitle}
        </Title>
      ),
      classNames: { content: "scrollbars" },
      innerProps: <ProductModalBody item={item} allItems={allItems} />,
      withinPortal: false,
    });
  }, [modalTitle, item]);

  return (
    <Stack className={classes.container} onClick={openProductModal}>
      {showOnCellAtc && (
        <Button
          component="label"
          htmlFor={item.asin}
          variant="transparent"
          className={classes.checkButton}
          onClick={handleAddToCard}
        >
          <IconShoppingBag className={classes.shoppingBag} />
          <Checkbox checked={added} id={item.asin} ml={rem(4)} readOnly />
        </Button>
      )}
      <Image src={item.image} width={200} height={200} alt="" className={classes.productImage} />
      <Stack className={classes.productMeta}>
        <Text className={classes.productTitle} lineClamp={2}>
          {item.name}
        </Text>
        <Rating size={14} defaultValue={Math.round(item.rating)} className={classes.rating} />
      </Stack>
    </Stack>
  );
};

export default ProductCell;
