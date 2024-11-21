import React, { useCallback, useState } from "react";
import { IconBooks, IconLicense, IconScan, IconTargetArrow } from "@tabler/icons-react";
import { Stack, Text } from "@mantine/core";
import LinkRow from "./LinkRow";
import classes from "./DrawerNavigation.module.css";

const defaultNavigation = [
  {
    title: "Results",
    icon: <IconTargetArrow stroke={1.25} className="icon" />,
    path: "/results",
    children: [
      { title: "Progress", path: "/results" },
      { title: "Style", path: "/style" },
      { title: "Uploads", path: "uploads" },
    ],
  },
  {
    title: "Solutions",
    path: "/solutions",
    icon: <IconBooks stroke={1.25} className="icon" />,
  },
];

const authenticatedNavigation = [
  {
    title: "Scan",
    icon: <IconScan stroke={1.25} className="icon" />,
    path: "/scan",
    children: [],
  },
  {
    title: "Routines",
    path: "/routines",
    icon: <IconBooks stroke={1.25} className="icon" />,
  },
  {
    title: "My results",
    icon: <IconTargetArrow stroke={1.25} className="icon" />,
    path: "/my-results",
    children: [
      { title: "Progress", path: "/my-results" },
      { title: "Style", path: "/my-style" },
      { title: "Uploads", path: "my-uploads" },
    ],
  },
];

const legalLinks = [
  {
    title: "Terms of Service",
    path: "/legal/terms",
    icon: <IconLicense stroke={1.25} className="icon" />,
  },
  {
    title: "Privacy Policy",
    path: "/legal/terms",
    icon: <IconLicense stroke={1.25} className="icon" />,
  },
  {
    title: "Club Agreement",
    path: "/legal/club",
    icon: <IconLicense stroke={1.25} className="icon" />,
  },
];

type Props = {
  status: string;
};

export default function DrawerNavigation({ status }: Props) {
  const [linkClicked, setLinkClicked] = useState("");
  const year = new Date().getFullYear();

  const handleClickLink = useCallback(
    (path: string) => {
      setLinkClicked(path === linkClicked ? "" : path);
    },
    [linkClicked]
  );

  return (
    <Stack className={classes.container}>
      {defaultNavigation.map((link, index) => (
        <LinkRow
          key={index}
          link={link}
          linkClicked={linkClicked}
          handleClickLink={handleClickLink}
        />
      ))}
      {status === "authenticated" && (
        <>
          {authenticatedNavigation.map((link, index) => (
            <LinkRow
              key={index}
              link={link}
              linkClicked={linkClicked}
              handleClickLink={handleClickLink}
            />
          ))}
        </>
      )}
      <Stack className={classes.footer}>
        {legalLinks.map((link, index) => (
          <LinkRow
            key={index}
            link={link}
            linkClicked={linkClicked}
            handleClickLink={handleClickLink}
          />
        ))}
        <Text className={classes.copyright}>&copy; {year} Max You Out. All rights reserved</Text>
      </Stack>
    </Stack>
  );
}
