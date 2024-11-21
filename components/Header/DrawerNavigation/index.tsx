import React, { useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconBooks,
  IconDoorExit,
  IconLicense,
  IconRotateDot,
  IconScan,
  IconSettings,
  IconStar,
  IconTarget,
  IconTargetArrow,
} from "@tabler/icons-react";
import { Divider, Stack, Text, UnstyledButton } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import { clearCookies } from "@/helpers/cookies";
import { deleteFromLocalStorage } from "@/helpers/localStorage";
import LinkRow, { NavigationLinkType } from "./LinkRow";
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
  {
    title: "Reviews",
    path: "/reviews",
    icon: <IconStar stroke={1.25} className="icon" />,
  },
];

const defaultAuthenticatedNavigation = [
  {
    title: "Scan",
    icon: <IconScan stroke={1.25} className="icon" />,
    path: "/scan",
  },
  {
    title: "My routines",
    path: "/my-routines",
    icon: <IconRotateDot stroke={1.25} className="icon" />,
    children: [
      { title: "Current", path: "/my-routines" },
      { title: "History", path: "/my-routines/history" },
    ],
  },
  {
    title: "My results",
    icon: <IconTargetArrow stroke={1.25} className="icon" />,
    path: "/my-results",
    children: [
      { title: "Progress", path: "/my-results" },
      { title: "Style", path: "/my-results/style" },
      { title: "Uploads", path: "my-results/uploads" },
      { title: "Analysis", path: "my-results/analysis" },
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

export default function DrawerNavigation() {
  const router = useRouter();
  const { status, userDetails, setUserDetails, setStatus } = useContext(UserContext);
  const [linkClicked, setLinkClicked] = useState("");
  const year = new Date().getFullYear();

  const handleClickLink = useCallback(
    (path: string) => {
      setLinkClicked(path === linkClicked ? "" : path);
    },
    [linkClicked]
  );

  const handleSignOut = useCallback(async () => {
    router.replace("/");
    clearCookies();
    deleteFromLocalStorage("userDetails");
    setStatus("unauthenticated");
    setUserDetails(null);
  }, []);

  const finalAuthenticatedNavigation = useMemo(() => {
    const { payouts } = userDetails?.club || {};
    const { detailsSubmitted } = payouts || {};
    const finalNavigation: NavigationLinkType[] = [...defaultAuthenticatedNavigation];

    if (userDetails?.club) {
      if (detailsSubmitted) {
        finalNavigation.push({
          title: "Club",
          path: "/club",
          icon: <IconTarget stroke={1.25} className="icon" />,
          children: [
            { title: "Profile", path: "/club" },
            { title: "About", path: "/club/about" },
            { title: "Routines", path: "/club/routines" },
          ],
        });
      } else {
        finalNavigation.push({
          title: "Join club",
          path: "/club/registration",
          icon: <IconTarget stroke={1.25} className="icon" />,
        });
      }
    } else {
      finalNavigation.push({
        title: "Join club",
        path: "/club/join",
        icon: <IconTarget stroke={1.25} className="icon" />,
      });
    }

    finalNavigation.push({
      title: "Settings",
      path: "/settings",
      icon: <IconSettings stroke={1.25} className="icon" />,
    });
    return finalNavigation;
  }, [typeof userDetails?.club]);

  return (
    <Stack className={classes.container}>
      <Divider/>
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
          <Divider />
          {finalAuthenticatedNavigation.map((link, index) => (
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
        <UnstyledButton className={classes.signOutButton} onClick={handleSignOut}>
          <IconDoorExit className="icon" stroke={1.25} />
          Sign out
        </UnstyledButton>
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
