"use client";

import React, { useState } from "react";
import { Button, Stack, Text, TextInput } from "@mantine/core";
import callTheServer from "@/functions/callTheServer";
import classes from "./SelectCountry.module.css";

export const runtime = "edge";

type Props = {
  onClick: (newCountry: string) => Promise<void> | void;
};

export default function SelectCountry({ onClick }: Props) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState<string>("");

  const handleClick = async () => {
    if (isLoading) return;
    if (!country?.trim()) return;

    setIsLoading(true);

    try {
      const response = await callTheServer({
        endpoint: "checkCountry",
        method: "POST",
        body: { country },
      });

      if (response.status === 200) {
        if (response.error) {
          setError(response.error);
          setIsLoading(false);
          return;
        }

        onClick(response.message);
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <Stack className={classes.container}>
      {error && (
        <Text size="sm" className={classes.error}>
          {error}
        </Text>
      )}
      <TextInput
        onChange={(e) => {
          setCountry(e.currentTarget.value);
          setError("");
        }}
        value={country || ""}
        placeholder="Type in your country"
      />
      <Button
        loading={isLoading}
        disabled={isLoading || country.trim().length === 0}
        onClick={handleClick}
      >
        Next
      </Button>
    </Stack>
  );
}
