import React from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, rem } from "@mantine/core";
import TitleDropdown from "@/app/results/TitleDropdown";
import { useRouter } from "@/helpers/custom-router";
import classes from "./ScanHeader.module.css";

const titles = [
  { label: "Scan progress", value: "/scan/progress" },
  { label: "Scan style", value: "/scan/style" },
  { label: "Scan food", value: "/scan/food" },
];

type Props = {
  children?: React.ReactNode;
};

function ScanHeader({ children }: Props) {
  const router = useRouter();

  return (
    <Group className={classes.container}>
      <Group className={classes.head}>
        <ActionIcon variant="default" onClick={() => router.back()}>
          <IconChevronLeft className="icon" />
        </ActionIcon>
        <TitleDropdown
          titles={titles}
          customDropdownStyles={{ minWidth: rem(210) }}
          customHeadStyles={{ marginRight: "unset" }}
        />
        {children}
      </Group>
    </Group>
  );
}

export default ScanHeader;
