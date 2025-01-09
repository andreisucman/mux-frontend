"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
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
  const { ref } = useElementSize();
  const searchParams = useSearchParams();

  const [uniqueTasks, setUniqueTasks] = useState<TaskType[]>();
  const [selectedAsins, setSelectedAsins] = useState<string[]>([]);

  const type = searchParams.get("type");

  const fetchProducts = useCallback(async (type: TypeEnum) => {
    try {
      let endpoint = "getTasksProducts";
      if (type) endpoint += `?type=${type}`;

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
    fetchProducts(type as TypeEnum);
  }, [type, status]);

  return (
    <Stack className={`${classes.container} smallPage`} ref={ref}>
      <SkeletonWrapper>
        <PageHeader title="Products for tasks" showReturn hidePartDropdown />
        {uniqueTasks ? (
          <>
            {uniqueTasks.length > 0 ? (
              <Stack className={classes.content}>
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
                text={`No suggested products for your ${type ? type : ""} routine.`}
              />
            )}
          </>
        ) : (
          <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
        )}
        {selectedAsins.length > 0 && (
          <Button
            mt={rem(12)}
            style={uniqueTasks ? {} : { visibility: "hidden" }}
            disabled={selectedAsins.length === 0}
            onClick={() => addToAmazonCart(selectedAsins)}
          >
            Add to cart {selectedAsins.length > 0 ? `(${selectedAsins.length})` : ""}
          </Button>
        )}
      </SkeletonWrapper>
    </Stack>
  );
}
