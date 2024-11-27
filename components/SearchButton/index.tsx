import React, { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";
import { ActionIcon, Group, Pill, rem } from "@mantine/core";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./SearchButton.module.css";

type Props = {
  onSearchClick?: () => void;
  maxPillWidth: number;
};

export default function SearchButton({ onSearchClick, maxPillWidth }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const originalRouter = useRouter();
  const query = searchParams.get("query");

  const removeSearchQuery = useCallback(() => {
    const newQuery = modifyQuery({ params: [{ name: "query", value: null, action: "delete" }] });
    let newUrl = pathname;
    if (newQuery) newUrl += `?${newQuery}`;
    originalRouter.replace(newUrl);
  }, []);

  return (
    <Group className={classes.container}>
      {query && (
        <Pill
          className={classes.pill}
          styles={{ root: { maxWidth: rem(maxPillWidth) } }}
          onRemove={removeSearchQuery}
          withRemoveButton
        >
          {query}
        </Pill>
      )}
      <ActionIcon variant="default" onClick={onSearchClick}>
        <IconSearch className="icon icon__small" />
      </ActionIcon>
    </Group>
  );
}
