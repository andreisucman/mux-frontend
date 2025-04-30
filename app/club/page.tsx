"use client";

import React, { useEffect, useState } from "react";
import cn from "classnames";
import { rem, SegmentedControl, Stack } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import SkeletonWrapper from "../SkeletonWrapper";
import ClubBuyerContent from "./ClubBuyerContent";
import ClubSellerContent from "./ClubSellerContent";
import classes from "./club.module.css";

export const runtime = "edge";

const segments = [
  { label: "Buyer", value: "buyer" },
  { label: "Seller", value: "seller" },
];

export default function Club() {
  const [selectedSegment, setSelectedSegment] = useState<string>();
  const savedSegment = getFromLocalStorage("clubSegment");

  useEffect(() => {
    if (savedSegment && typeof savedSegment === "string") {
      setSelectedSegment(savedSegment);
    } else {
      setSelectedSegment("buyer");
    }
  }, [savedSegment]);

  const handleChangeSegment = (segment: string) => {
    setSelectedSegment(segment);
    saveToLocalStorage("clubSegment", segment);
  };

  return (
    <Stack className={cn(classes.container, "smallPage")}>
      <PageHeader title="Club profile" />
      <SkeletonWrapper>
        <SegmentedControl
          classNames={{
            label: "segmentControlLabel",
            root: "segmentControlRoot",
          }}
          value={selectedSegment}
          data={segments}
          onChange={handleChangeSegment}
        />
        {selectedSegment === "buyer" && <ClubBuyerContent />}
        {selectedSegment === "seller" && <ClubSellerContent />}
      </SkeletonWrapper>
    </Stack>
  );
}
