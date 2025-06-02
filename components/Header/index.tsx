"use client";

import { CSSProperties, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconDoorEnter, IconMessageDollar, IconRocket } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Button, Drawer, Group, rem, Title } from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { createSpotlight } from "@mantine/spotlight";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import GlowingButton from "@/components/GlowingButton";
import DrawerNavigation from "@/components/Header/DrawerNavigation";
import Logo from "@/components/Header/Logo";
import { UserContext } from "@/context/UserContext";
import { clearCookies } from "@/helpers/cookies";
import { deleteFromLocalStorage } from "@/helpers/localStorage";
import openAuthModal from "@/helpers/openAuthModal";
import openFeedbackModal from "@/helpers/openFeedbackModal";
import { matchBySegments } from "@/helpers/utils";
import AvatarComponent from "../AvatarComponent";
import SearchButton from "../SearchButton";
import Burger from "./Burger";
import UserButton from "./UserButton";
import classes from "./Header.module.css";

const showStartButtonRoutes = [
  "/",
  "/progress",
  "/proof",
  "/rewards",
  "/reviews",
  "/legal/terms",
  "/legal/privacy",
  "/legal/club",
];
const showSignInButtonRoutes = [
  "/scan",
  "/accept",
  "/select-part",
  "/select-concern",
  "/club/routines",
  "/club/progress",
  "/club/diary",
  "/club/proof",
];

const [spotlightStore, userSpotlight] = createSpotlight();

function Header() {
  const pinned = useHeadroom({ fixedAt: 120 });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [navigationDrawerOpen, { toggle, close }] = useDisclosure(false);
  const { status, userDetails, setStatus, setUserDetails } = useContext(UserContext);
  const [displayComponent, setDisplayComponent] = useState("none");

  const { avatar, club, _id: userId } = userDetails || {};

  const showStartButton = useMemo(
    () => showStartButtonRoutes.some((route) => pathname === route),
    [pathname]
  );

  const showSignInButton = useMemo(
    () => showSignInButtonRoutes.some((route) => matchBySegments(route, pathname)),
    [pathname]
  );

  const headerStyles = useMemo(() => {
    return status ? { visibility: "visible" } : { visibility: "hidden" };
  }, [status]);

  const handleRedirect = (referrer: "signInButton" | "startButton") => {
    if (isLoading) return;
    setIsLoading(true);

    if (referrer === "signInButton") {
      let routeReferrer = ReferrerEnum.SCAN;

      if (pathname.includes("/select-part")) {
        routeReferrer = ReferrerEnum.CHOOSE_PART;
      } else if (pathname.includes("/scan")) {
        routeReferrer = ReferrerEnum.SCAN;
      } else if (pathname.includes("/club/routines")) {
        routeReferrer = ReferrerEnum.CLUB_ROUTINES;
      } else if (pathname.includes("/club/progress")) {
        routeReferrer = ReferrerEnum.CLUB_PROGRESS;
      } else if (pathname.includes("/club/diary")) {
        routeReferrer = ReferrerEnum.CLUB_DIARY;
      } else if (pathname.includes("/club/proof")) {
        routeReferrer = ReferrerEnum.CLUB_PROOF;
      } else {
        router.push("/auth");
        return;
      }

      openAuthModal({
        title: "Sign in to continue",
        stateObject: {
          redirectPath: pathname,
          localUserId: userId,
          redirectQuery: searchParams.toString(),
          referrer: routeReferrer,
        },
      });

      setIsLoading(false);
    }

    if (referrer === "startButton") {
      router.push("/about");
    }
  };

  const handleSignOut = useCallback(async () => {
    clearCookies(() => {
      deleteFromLocalStorage("userDetails");
      setStatus("unauthenticated");
      setUserDetails(null);
      close();
    });
  }, []);

  const constructUserActions = (list: { avatar: any; name: string }[]) => {
    const actions = list.map((item) => ({
      id: item.name as string,
      label: item.name,
      leftSection: <AvatarComponent avatar={item.avatar} size="sm" />,
      onClick: () => router.push(`/club/routines/${item.name}`),
    }));

    return actions;
  };

  useEffect(() => {
    if (status === "unknown") {
      setDisplayComponent("none");
    } else if (status === "authenticated") {
      setDisplayComponent("userButton");
    } else if (status === "unauthenticated" && showStartButton) {
      setDisplayComponent("startButton");
    } else if (status === "unauthenticated" && showSignInButton) {
      setDisplayComponent("signInButton");
    } else {
      setDisplayComponent("default");
    }
  }, [status, showStartButton, showSignInButton]);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <>
      <header className={cn(classes.container, { [classes.sticky]: pinned })}>
        <div className={classes.wrapper}>
          <Logo />
          <Group className={classes.navigation} style={headerStyles as CSSProperties}>
            {displayComponent === "startButton" && (
              <GlowingButton
                text="Start"
                aria-label="start analysis button"
                loading={isLoading}
                disabled={isLoading}
                icon={<IconRocket stroke={1.5} size={24} style={{ marginRight: rem(6) }} />}
                onClick={() => handleRedirect("startButton")}
              />
            )}
            {displayComponent === "signInButton" && (
              <Button
                aria-label="sign in button"
                loading={isLoading}
                disabled={isLoading}
                variant={"default"}
                onClick={() => handleRedirect("signInButton")}
              >
                <IconDoorEnter stroke={1.75} size={20} style={{ marginRight: rem(6) }} />
                Sign in
              </Button>
            )}
            {displayComponent !== "none" && (
              <>
                <SearchButton
                  size="lg"
                  collection="user"
                  searchPlaceholder="Search users"
                  forceEnabled
                  spotlight={userSpotlight}
                  spotlightStore={spotlightStore}
                  customConstructAction={constructUserActions}
                />
                {displayComponent === "userButton" && (
                  <>
                    <ActionIcon variant="default" onClick={openFeedbackModal} size="lg">
                      <IconMessageDollar size={22} stroke={1.25} />
                    </ActionIcon>
                    <UserButton
                      avatar={avatar}
                      isClubActive={!!club && club.isActive}
                      handleSignOut={handleSignOut}
                    />
                  </>
                )}
              </>
            )}
            <Burger onClick={toggle} />
          </Group>
        </div>
      </header>

      <Drawer
        position="right"
        size="xs"
        title={
          <Title order={5} component={"p"}>
            Navigation
          </Title>
        }
        opened={navigationDrawerOpen}
        onClose={close}
        onChange={toggle}
        classNames={{
          title: classes.drawerTitle,
          content: classes.drawerContent,
          body: classes.drawerBody,
          overlay: "overlay",
        }}
      >
        <DrawerNavigation closeDrawer={close} handleSignOut={handleSignOut} />
      </Drawer>
    </>
  );
}

export default memo(Header);
