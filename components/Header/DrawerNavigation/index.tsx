import React, { useCallback, useContext, useMemo, useState } from "react";
import {
  IconBooks,
  IconDoorEnter,
  IconDoorExit,
  IconInnerShadowBottom,
  IconLicense,
  IconNotebook,
  IconRotateDot,
  IconScan,
  IconSettings,
  IconShoppingBag,
  IconSocial,
  IconTargetArrow,
  IconTrophy,
} from "@tabler/icons-react";
import { Divider, Stack, Text, UnstyledButton } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import LinkRow, { NavigationLinkType } from "./LinkRow";
import classes from "./DrawerNavigation.module.css";

const defaultNavigation = [
  {
    title: "Results",
    icon: <IconTargetArrow stroke={1.25} className="icon" />,
    path: "/",
    children: [
      { title: "Progress", path: "/" },
      { title: "Style", path: "/style" },
      { title: "Proof", path: "/proof" },
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
    title: "Rewards",
    path: "/rewards",
    icon: <IconTrophy stroke={1.25} className="icon" />,
  },
];

const defaultAuthenticatedNavigation = [
  {
    title: "My tasks",
    path: "/tasks",
    icon: <IconRotateDot stroke={1.25} className="icon" />,
    children: [
      { title: "Current", path: "/tasks" },
      { title: "Calendar", path: "/tasks/calendar" },
      { title: "History", path: "/tasks/history" },
    ],
  },
  {
    title: "My results",
    icon: <IconTargetArrow stroke={1.25} className="icon" />,
    path: "/results",
    children: [
      { title: "Progress", path: "/results" },
      { title: "Style", path: "/results/style" },
      { title: "Proof", path: "/results/proof" },
      { title: "Analysis", path: "/analysis" },
    ],
  },
  {
    title: "My diary",
    icon: <IconNotebook stroke={1.25} className="icon" />,
    path: "/diary",
  },
  {
    title: "My advisor",
    icon: <IconInnerShadowBottom stroke={1.25} className="icon" />,
    path: "/advisor?type=head",
  },
  {
    title: "My products",
    path: "/products",
    icon: <IconShoppingBag stroke={1.25} className="icon" />,
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
  handleSignOut: () => void;
  closeDrawer: () => void;
};

export default function DrawerNavigation({ closeDrawer, handleSignOut }: Props) {
  const router = useRouter();
  const { status, userDetails } = useContext(UserContext);
  const [linkClicked, setLinkClicked] = useState("");
  const year = new Date().getFullYear();

  const { _id: userId, name } = userDetails || {};

  const handleClickLink = useCallback(
    (path: string) => {
      setLinkClicked(path === linkClicked ? "" : path);
    },
    [linkClicked]
  );

  const handleClickSignIn = () => {
    router.push("/auth");
    closeDrawer();
  };

  const finalAuthenticatedNavigation = useMemo(() => {
    const { club } = userDetails || {};
    const finalNavigation: NavigationLinkType[] = [...defaultAuthenticatedNavigation];

    if (club) {
      finalNavigation.push({
        title: "Club profile",
        path: "/club",
        icon: <IconSocial stroke={1.25} className="icon" />,
        children: [
          { title: "Profile", path: "/club" },
          { title: "About", path: `/club/${name}` },
          { title: "Routines", path: `/club/routines/${name}` },
          { title: "Diary", path: `/club/diary/${name}` },
          { title: "Answers", path: `/club/diary/${name}` },
        ],
      });
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
  }, [typeof userDetails?.club, name]);

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
            <UnstyledButton className={classes.signInButton} onClick={handleSignOut}>
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
        <Text className={classes.copyright}>&copy; {year} Muxout. All rights reserved</Text>
      </Stack>
    </Stack>
  );
}
