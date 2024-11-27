"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack } from "@mantine/core";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import StyleHeader from "./ProofHeader";
import StyleGallery from "./StyleGallery";
import { HandleFetchProofType } from "./types";
import classes from "./style.module.css";

export const runtime = "edge";

export default function ResultStyle() {
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const [styles, setStyles] = useState<SimpleStyleType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || "head";
  const styleName = searchParams.get("styleName");
  const { _id: userId } = userDetails || {};

  const handleFetchStyles = useCallback(
    async ({ type, concern, part, skip }: HandleFetchProofType) => {
      if (!userId) return;

      try {
        const parts = [];

        if (type) {
          parts.push(`type=${type}`);
        }

        if (part) {
          parts.push(`part=${part}`);
        }

        if (concern) {
          parts.push(`concern=${concern}`);
        }

        if (skip && styles) {
          parts.push(`skip=${styles.length}`);
        }

        const query = parts.join("&");

        const endpoint = `getProofRecords${query ? `?${query}` : ""}`;

        const response = await callTheServer({
          endpoint,
          method: "GET",
        });

        if (response.status === 200) {
          if (skip) {
            setStyles([...(styles || []), ...response.message.slice(0, 6)]);
          } else {
            setStyles(response.message.slice(0, 6));
          }
          setHasMore(response.message.length === 7);
        } else {
          openErrorModal();
        }
      } catch (err) {
        console.log("Error in handleFetchStyles: ", err);
      }
    },
    [userId, styles && styles.length]
  );

  useEffect(() => {
    if (!userId) return;

    handleFetchStyles({ type, styleName });
  }, [userId, type, styleName]);

  return (
    <Stack className={classes.container}>
      <StyleHeader
        title="Style"
        isDisabled={!styles || (styles && styles.length === 0)}
        showReturn
      />
      {styles ? (
        <StyleGallery
          styles={styles}
          hasMore={hasMore}
          handleFetchStyles={handleFetchStyles}
          setStyles={setStyles}
        />
      ) : (
        <Loader m="auto" />
      )}
    </Stack>
  );
}
