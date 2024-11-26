import React, { useEffect, useState } from "react";
import { Rating, Skeleton, Stack, Text } from "@mantine/core";
import { ReviewCardType } from "../types";
import classes from "./ReviewCard.module.css";

type Props = { data: ReviewCardType };

export default function ReviewCard({ data }: Props) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const tId = setTimeout(() => {
      setShowSkeleton(false);
      clearTimeout(tId);
    }, Number(process.env.NEXT_PUBLIC_SKELETON_DURATION));
  }, []);

  return (
    <Skeleton visible={showSkeleton} className="skeleton">
      <Stack className={classes.container}>
        <Rating value={data.rating} />
        <Text className={classes.text}>{data.text}</Text>
      </Stack>
    </Skeleton>
  );
}
