import React, { useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconBrandInstagram,
  IconCalendar,
  IconDoorEnter,
  IconDoorExit,
  IconInfoSquareRounded,
  IconLicense,
  IconListDetails,
  IconMessageReply,
  IconNotebook,
  IconRoute,
  IconScan,
  IconSettings,
  IconSocial,
  IconTargetArrow,
  IconTrophy,
} from "@tabler/icons-react";
import { Divider, rem, Stack, Text, UnstyledButton } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import openFeedbackModal from "@/helpers/openFeedbackModal";
import { NavigationLinkType } from "./LinkRow";
import NavigationStack from "./NavigationStack";
import classes from "./DrawerNavigation.module.css";

const defaultNavigation = [
  {
    title: "Results",
    icon: <IconTargetArrow stroke={1.25} size={20} />,
    path: "/",
  },
  {
    title: "Scan",
    icon: <IconScan stroke={1.35} size={20} />,
    path: "/select-part",
  },
  {
    title: "Rewards",
    path: "/rewards",
    icon: <IconTrophy stroke={1.25} size={20} />,
  },
  {
    title: "About",
    path: "/about",
    icon: <IconInfoSquareRounded stroke={1.35} style={{ maxWidth: rem(19) }} />,
  },
];

const defaultAuthenticatedNavigation = [
  {
    title: "My tasks",
    path: "/tasks",
    icon: <IconListDetails stroke={1.25} size={20} />,
    children: [
      { title: "Current", path: "/tasks" },
      { title: "History", path: "/tasks/history" },
    ],
  },
  {
    title: "My routines",
    path: "/routines",
    icon: <IconRoute stroke={1.25} size={20} />,
  },
  {
    title: "My diary",
    icon: <IconNotebook stroke={1.25} size={20} />,
    path: "/diary",
  },
  {
    title: "My results",
    icon: <IconTargetArrow stroke={1.25} size={20} />,
    path: "/results",
    children: [
      { title: "Progress", path: "/results" },
      { title: "Proof", path: "/results/proof" },
      { title: "Analysis", path: "/analysis" },
    ],
  },
  {
    title: "My calendar",
    path: "/calendar",
    icon: <IconCalendar stroke={1.25} size={20} />,
  },
];

const legalLinks = [
  {
    title: "Terms",
    path: "/legal/terms",
    icon: <IconLicense stroke={1.25} size={16} />,
  },
  {
    title: "Privacy",
    path: "/legal/privacy",
    icon: <IconLicense stroke={1.25} size={16} />,
  },
  {
    title: "Club",
    path: "/legal/club",
    icon: <IconLicense stroke={1.25} size={16} />,
  },
];

const socialLinks = [
  {
    title: "Instagram",
    path: "https://www.instagram.com/muxout_com/",
    icon: <IconBrandInstagram stroke={1.25} size={16} />,
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

  const { name } = userDetails || {};

  const clickLink = useCallback(
    (path: string) => {
      setLinkClicked(path === linkClicked ? "" : path);
    },
    [linkClicked]
  );

  const handleRedirect = useCallback((path: string) => {
    router.push(path);
    closeDrawer();
  }, []);

  const finalAuthenticatedNavigation = useMemo(() => {
    const { club } = userDetails || {};
    const finalNavigation: NavigationLinkType[] = [...defaultAuthenticatedNavigation];
    if (club?.isActive) {
      finalNavigation.push({
        title: "My club",
        path: "/club",
        icon: <IconSocial stroke={1.25} size={20} />,
        children: [
          { title: "Profile", path: "/club" },
          { title: "Routines", path: `/club/routines/${name}` },
          { title: "Progress", path: `/club/progress/${name}` },
          { title: "Proof", path: `/club/proof/${name}` },
          { title: "Diary", path: `/club/diary/${name}` },
        ],
      });
    } else {
      finalNavigation.push({
        title: "Join club",
        path: "/club/join",
        icon: <IconSocial stroke={1.25} size={20} />,
      });
    }

    return (
      <NavigationStack
        clickLink={clickLink}
        closeDrawer={closeDrawer}
        linkClicked={linkClicked}
        links={finalNavigation}
        showLowerDivider
      />
    );
  }, [userDetails?.club, name, linkClicked]);

  const legalNavigation = useMemo(() => {
    return (
      <NavigationStack
        clickLink={clickLink}
        closeDrawer={closeDrawer}
        linkClicked={linkClicked}
        links={legalLinks}
        customStyles={{ flexDirection: "row" }}
      />
    );
  }, [status, linkClicked]);

  const socialsNavigation = useMemo(() => {
    return (
      <NavigationStack
        clickLink={clickLink}
        closeDrawer={closeDrawer}
        linkClicked={linkClicked}
        links={socialLinks}
        customStyles={{ flexDirection: "row" }}
      />
    );
  }, [status, linkClicked]);

  return (
    <Stack className={classes.container}>
      <Divider />
      <>
        <NavigationStack
          clickLink={clickLink}
          closeDrawer={closeDrawer}
          linkClicked={linkClicked}
          links={defaultNavigation}
          showLowerDivider
        />
        {status !== "authenticated" && (
          <UnstyledButton className={classes.signInButton} onClick={() => handleRedirect("/auth")}>
            <IconDoorEnter size={20} stroke={1.25} />
            Sign in/up
          </UnstyledButton>
        )}
      </>

      {status === "authenticated" && (
        <>
          {finalAuthenticatedNavigation}
          <UnstyledButton className={classes.signInButton} onClick={openFeedbackModal}>
            <IconMessageReply size={20} stroke={1.25} />
            Feedback ($)
          </UnstyledButton>
          <UnstyledButton
            className={classes.signInButton}
            onClick={() => handleRedirect("/settings")}
          >
            <IconSettings size={20} stroke={1.25} />
            Settings
          </UnstyledButton>
          <UnstyledButton className={classes.signInButton} onClick={handleSignOut}>
            <IconDoorExit size={20} stroke={1.25} />
            Sign out
          </UnstyledButton>
        </>
      )}
      <Stack className={classes.footer}>
        {socialsNavigation}
        {legalNavigation}
        <Text className={classes.copyright}>&copy; {year} Muxout. All rights reserved</Text>
      </Stack>
    </Stack>
  );
}
