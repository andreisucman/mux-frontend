import React from "react";
import { useSearchParams } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";
import { ActionIcon, Group, Indicator } from "@mantine/core";
import classes from "./SearchButton.module.css";

type Props = {
  onSearchClick?: () => void;
  isDisabled?: boolean;
};

export default function SearchButton({ onSearchClick,isDisabled }: Props) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return (
    <Group className={classes.container}>
      {query && <Indicator size={12} className={classes.indicator} />}
      <ActionIcon variant="default" onClick={onSearchClick} disabled={isDisabled}>
        <IconSearch className="icon" />
      </ActionIcon>
    </Group>
  );
}
