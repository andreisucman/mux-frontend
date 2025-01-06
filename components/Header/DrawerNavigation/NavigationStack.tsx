import React from "react";
import { Divider, Stack } from "@mantine/core";
import LinkRow, { NavigationLinkType } from "./LinkRow";

type Props = {
  showUpperDivider?: boolean;
  showLowerDivider?: boolean;
  links: NavigationLinkType[];
  linkClicked: string;
  clickLink: (path: string) => void;
  closeDrawer: () => void;
};

export default function NavigationStack({
  links,
  linkClicked,
  showUpperDivider,
  showLowerDivider,
  clickLink,
  closeDrawer,
}: Props) {
  return (
    <Stack>
      {showUpperDivider && <Divider />}
      {links.map((link, index) => (
        <LinkRow
          key={index}
          link={link}
          linkClicked={linkClicked}
          clickLink={clickLink}
          closeDrawer={closeDrawer}
        />
      ))}
      {showLowerDivider && <Divider />}
    </Stack>
  );
}
