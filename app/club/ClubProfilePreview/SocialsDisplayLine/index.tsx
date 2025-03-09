import React, { useMemo } from "react";
import { IconLink } from "@tabler/icons-react";
import cn from "classnames";
import { Group, Text, UnstyledButton } from "@mantine/core";
import { useRouter } from "next/navigation";
import classes from "./SocialsDisplayLine.module.css";

type Props = {
  socials: { value: string | null; label: string }[];
};

export default function SocialsDisplayLine({ socials }: Props) {
  const router = useRouter();

  const handleRedirect = (path: string | null) => {
    if (!path) return;
    router.push(path);
  };

  const links = useMemo(
    () =>
      socials.map((item, index) => (
        <UnstyledButton
          onClick={() => handleRedirect(item.value)}
          className={cn(classes.link, { [classes.disabledLink]: !item.value })}
          key={`${item.value}-${index}`}
        >
          <IconLink className={`icon icon__small ${classes.icon}`} />
          <Text size="xs" className={cn({ [classes.disabledLink]: !item.value })}>
            {item.label || item.value}
          </Text>
        </UnstyledButton>
      )),
    []
  );

  return (
    <Group className={classes.container}>
      <Group className={classes.wrapper}>{links}</Group>
    </Group>
  );
}
