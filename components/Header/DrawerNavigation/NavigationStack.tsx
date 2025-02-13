import React from "react";
import { Divider, Stack } from "@mantine/core";
import LinkRow, { NavigationLinkType } from "./LinkRow";

type Props = {
  showUpperDivider?: boolean;
  showLowerDivider?: boolean;
  links: NavigationLinkType[];
  linkClicked: string;
  customStyles?: { [key: string]: any };
  clickLink: (path: string) => void;
  closeDrawer: () => void;
};

export default function NavigationStack({
  links,
  linkClicked,
  showUpperDivider,
  showLowerDivider,
  customStyles,
  clickLink,
  closeDrawer,
}: Props) {
  return (
    <Stack style={customStyles || {}}>
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
