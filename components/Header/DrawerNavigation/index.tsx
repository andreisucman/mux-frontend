import React, { useCallback, useContext, useMemo, useState } from "react";
import {
  IconBooks,
  IconDoorEnter,
  IconDoorExit,
  IconLicense,
  IconRotateDot,
  IconScan,
  IconSettings,
  IconSocial,
  IconStar,
  IconTarget,
  IconTargetArrow,
  IconTrophy,
} from "@tabler/icons-react";
import { Divider, Stack, Text, UnstyledButton } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import { clearCookies } from "@/helpers/cookies";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
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
    title: "Scan",
    icon: <IconScan stroke={1.25} className="icon" />,
    path: "/scan",
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
  {
    title: "Rewards",
    path: "/rewards",
    icon: <IconTrophy stroke={1.25} className="icon" />,
  },
];

const defaultAuthenticatedNavigation = [
  {
    title: "My routines",
    path: "/routines",
    icon: <IconRotateDot stroke={1.25} className="icon" />,
    children: [
      { title: "Current", path: "/routines" },
      { title: "Calendar", path: "/routines/calendar" },
      { title: "History", path: "/routines/history" },
      { title: "Products", path: "/routines/products" },
    ],
  },
  {
    title: "My results",
    icon: <IconTargetArrow stroke={1.25} className="icon" />,
    path: "/progress",
    children: [
      { title: "Progress", path: "/progress" },
      { title: "Style", path: "/style" },
      { title: "Uploads", path: "/proof" },
      { title: "Analysis", path: "/analysis" },
    ],
  },
];

const legalLinks = [
  {
    title: "Terms of Service",
    path: "/legal/terms",
    icon: <IconLicense stroke={1.25} className="icon icon__small" />,
  },
  {
    title: "Privacy Policy",
    path: "/legal/privacy",
    icon: <IconLicense stroke={1.25} className="icon icon__small" />,
  },
  {
    title: "Club Agreement",
    path: "/legal/club",
    icon: <IconLicense stroke={1.25} className="icon icon__small" />,
  },
];

type Props = {
  closeDrawer: () => void;
};
export default function DrawerNavigation({ closeDrawer }: Props) {
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
    closeDrawer();
  }, []);

  const handleClickSignIn = () => {
    router.push("/auth");
    closeDrawer();
  };

  const finalAuthenticatedNavigation = useMemo(() => {
    const { payouts } = userDetails?.club || {};
    const { detailsSubmitted } = payouts || {};
    const finalNavigation: NavigationLinkType[] = [...defaultAuthenticatedNavigation];

    if (userDetails?.club) {
      if (detailsSubmitted) {
        finalNavigation.push({
          title: "Club",
          path: "/club",
          icon: <IconSocial stroke={1.25} className="icon" />,
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
          icon: <IconSocial stroke={1.25} className="icon" />,
        });
      }
    } else {
      finalNavigation.push({
        title: "Join club",
        path: "/club/join",
        icon: <IconSocial stroke={1.25} className="icon" />,
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
      <Divider />
      <>
        {defaultNavigation.map((link, index) => (
          <LinkRow
            key={index}
            link={link}
            linkClicked={linkClicked}
            handleClickLink={handleClickLink}
            closeDrawer={closeDrawer}
          />
        ))}
        {status !== "authenticated" && (
          <UnstyledButton className={classes.signInButton} onClick={handleClickSignIn}>
            <IconDoorEnter className="icon" stroke={1.25} />
            Sign in
          </UnstyledButton>
        )}
      </>

      {status === "authenticated" && (
        <>
          <Divider />
          {finalAuthenticatedNavigation.map((link, index) => (
            <LinkRow
              key={index}
              link={link}
              linkClicked={linkClicked}
              handleClickLink={handleClickLink}
              closeDrawer={closeDrawer}
            />
          ))}
          {status === "authenticated" && (
            <UnstyledButton className={classes.signOutButton} onClick={handleSignOut}>
              <IconDoorExit className="icon" stroke={1.25} />
              Sign out
            </UnstyledButton>
          )}
        </>
      )}
      <Stack className={classes.footer}>
        {legalLinks.map((link, index) => (
          <LinkRow
            key={index}
            link={link}
            linkClicked={linkClicked}
            handleClickLink={handleClickLink}
            closeDrawer={closeDrawer}
            isSmall
          />
        ))}
        <Text className={classes.copyright}>&copy; {year} Max You Out. All rights reserved</Text>
      </Stack>
    </Stack>
  );
}
