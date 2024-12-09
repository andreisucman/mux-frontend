"use client";

import useSWR from "swr";
import React, { useCallback, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff, IconShoppingBag } from "@tabler/icons-react";
import { Button, Loader, rem, Stack } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { addToAmazonCart } from "@/helpers/addToAmazonCart";
import { TaskType, TypeEnum } from "@/types/global";
import ProductsRow from "./ProductsRow";
import classes from "./products.module.css";

export const runtime = "edge";

export default function Products() {
  const { status } = useContext(UserContext);
  const { width, ref } = useElementSize();
  const searchParams = useSearchParams();

  const [uniqueTasks, setUniqueTasks] = useState<TaskType[]>();
  const [selectedAsins, setSelectedAsins] = useState<string[]>([]);

  const type = searchParams.get("type");

  const fetchProducts = useCallback(async (type: TypeEnum) => {
    if (!type) return;

    try {
      const response = await callTheServer({
        endpoint: `getTasksProducts?type=${type}`,
        method: "GET",
      });

      if (response.status === 200) {
        const tasksWithSuggestions = response.message.filter((t: TaskType) => {
          return (t.suggestions || []).length > 0 || (t.defaultSuggestions || []).length > 0;
        });

        setUniqueTasks(tasksWithSuggestions);
      }
    } catch (err) {
      console.log(`Error in fetchProducts: ${err}`);
    }
  }, []);

  useSWR(`${type}-${status}`, () => fetchProducts(type as TypeEnum));

  return (
    <Stack className={`${classes.container} smallPage`} ref={ref}>
      <SkeletonWrapper>
        <PageHeader title="Products for tasks" showReturn hidePartDropdown />

        {uniqueTasks ? (
          <>
            {uniqueTasks.length > 0 ? (
              <Stack className={classes.content}>
                {/* <Stack className={classes.list} style={{ maxWidth: width }}> */}
                <Stack className={classes.list}>
                  {uniqueTasks.map((record) => {
                    return (
                      <ProductsRow
                        key={record._id}
                        task={record}
                        selectedAsins={selectedAsins}
                        setSelectedAsins={setSelectedAsins}
                        setUniqueTasks={setUniqueTasks}
                      />
                    );
                  })}
                </Stack>
              </Stack>
            ) : (
              <OverlayWithText
                icon={<IconCircleOff className="icon" />}
                text={`No suggested products for your ${type} routine.`}
              />
            )}
          </>
        ) : (
          <Loader style={{ margin: "15vh auto 0" }} />
        )}
        {selectedAsins.length > 0 && (
          <Button
            mt={rem(12)}
            style={uniqueTasks ? {} : { visibility: "hidden" }}
            disabled={selectedAsins.length === 0}
            onClick={() => addToAmazonCart(selectedAsins)}
          >
            <IconShoppingBag style={{ marginRight: rem(8) }} /> Add to cart{" "}
            {selectedAsins.length > 0 ? `(${selectedAsins.length})` : ""}
          </Button>
        )}
      </SkeletonWrapper>
    </Stack>
  );
}
