import React from "react";
import { IconLink } from "@tabler/icons-react";
import { Group, Text } from "@mantine/core";
import Link from "@/helpers/custom-router/patch-router/link";
import classes from "./SocialsDisplayLine.module.css";

type Props = {
  socials: { value: string; label: string }[];
};

export default function SocialsDisplayLine({ socials }: Props) {
  return (
    <Group className={classes.container}>
      <Group className={classes.wrapper}>
        {socials.map((item,index) => (
          <Link href={item.value} className={classes.link} key={`${item.value}-${index}`}>
            <IconLink className={`icon icon__small ${classes.icon}`} />
            <span className={classes.label}>{item.label || item.value}</span>
          </Link>
        ))}
      </Group>
    </Group>
  );
}
