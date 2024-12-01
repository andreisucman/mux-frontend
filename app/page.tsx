"use client";

import React, { useEffect, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import { SimpleBeforeAfterType } from "./types";
import classes from "./page.module.css";

export default function IndexPage() {
  const { userDetails } = useContext(UserContext);
  const [beforeAfters, setBeforeAfters] = useState<SimpleBeforeAfterType[]>();
  const [hasMore, setHasMore] = useState(false);

  const { _id: userId } = userDetails || {};
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "head";
  const query = searchParams.get("query");
  const part = searchParams.get("part");
  const sex = searchParams.get("sex");
  const ageInterval = searchParams.get("ageInterval");
  const ethnicity = searchParams.get("ethnicity");
  const concern = searchParams.get("concern");

  return <Stack className={`${classes.container} mediumPage`}>

  </Stack>;
}
