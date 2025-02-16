"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff, IconTrash } from "@tabler/icons-react";
import { ActionIcon, Button, Group, Loader, Stack } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import callTheServer from "@/functions/callTheServer";
import { addToAmazonCart } from "@/helpers/addToAmazonCart";
import { TaskType } from "@/types/global";
import ProductsRow from "./ProductsRow";
import classes from "./products.module.css";

export const runtime = "edge";

export default function Products() {
  const searchParams = useSearchParams();
  const { ref } = useElementSize();

  const part = searchParams.get("part");

  const [uniqueTasks, setUniqueTasks] = useState<TaskType[]>();
  const [selectedAsins, setSelectedAsins] = useState<string[]>([]);

  const fetchProducts = useCallback(async (part: string | null) => {
    try {
      let endpoint = "getTasksProducts";

      if (part) endpoint += `?part=${part}`;

      const response = await callTheServer({
        endpoint,
        method: "GET",
      });

      if (response.status === 200) {
        const tasksWithSuggestions = response.message.filter((t: TaskType) => {
          return (t.suggestions || []).length > 0;
        });

        setUniqueTasks(tasksWithSuggestions);
      }
    } catch (err) {}
  }, []);

  useEffect(() => {
    fetchProducts(part);
  }, [part]);

  return (
    <Stack className={`${classes.container} smallPage`} ref={ref}>
      <SkeletonWrapper>
        <PageHeader title="Products for tasks" showReturn />
        {uniqueTasks ? (
          <>
            {uniqueTasks.length > 0 ? (
              <Stack className={`${classes.content} scrollbar`}>
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
            ) : (
              <OverlayWithText icon={<IconCircleOff className="icon" />} text={`Nothing found`} />
            )}
          </>
        ) : (
          <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
        )}
      </SkeletonWrapper>
      {selectedAsins.length > 0 && (
        <Group className={classes.addToCartGroup}>
          <ActionIcon
            variant="default"
            style={uniqueTasks ? {} : { visibility: "hidden" }}
            onClick={() => setSelectedAsins([])}
          >
            <IconTrash className="icon" />
          </ActionIcon>
          <Button
            style={uniqueTasks ? {} : { visibility: "hidden" }}
            disabled={selectedAsins.length === 0}
            onClick={() => addToAmazonCart(selectedAsins)}
            flex={1}
          >
            Add to cart {selectedAsins.length > 0 ? `(${selectedAsins.length})` : ""}
          </Button>
        </Group>
      )}
    </Stack>
  );
}
