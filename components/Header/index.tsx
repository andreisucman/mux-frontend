"use client";

import { CSSProperties, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconDoorEnter, IconRocket, IconTargetArrow } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Button, Drawer, Group, rem, Text, Title } from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { createSpotlight } from "@mantine/spotlight";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import GlowingButton from "@/components/GlowingButton";
import DrawerNavigation from "@/components/Header/DrawerNavigation";
import Logo from "@/components/Header/Logo";
import { UserContext } from "@/context/UserContext";
import { clearCookies } from "@/helpers/cookies";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import { deleteFromLocalStorage } from "@/helpers/localStorage";
import openAuthModal from "@/helpers/openAuthModal";
import AvatarComponent from "../AvatarComponent";
import SearchButton from "../SearchButton";
import Burger from "./Burger";
import UserButton from "./UserButton";
import classes from "./Header.module.css";

const showStartButtonRoutes = [
  "/",
  "/progress",
  "/proof",
  "/solutions",
  "/rewards",
  "/reviews",
  "/legal/terms",
  "/legal/privacy",
  "/legal/club",
];
const showSignInButtonRoutes = ["/scan", "/accept", "/scan/progress", "/scan/food"];

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

  const { avatar, name, _id: userId } = userDetails || {};

  const showStartButton = useMemo(
    () => showStartButtonRoutes.some((route) => pathname === route),
    [pathname]
  );

  const showSignInButton = useMemo(
    () => showSignInButtonRoutes.some((route) => pathname === route),
    [pathname]
  );

  const headerStyles = useMemo(() => {
    return status ? { visibility: "visible" } : { visibility: "hidden" };
  }, [status]);

  const handleRedirect = (referrer: "signInButton" | "startButton") => {
    if (isLoading) return;
    setIsLoading(true);

    if (referrer === "signInButton") {
      if (["/scan/progress", "/scan/food", "/scan"].includes(pathname)) {
        const referrer =
          pathname === "/scan/progress"
            ? ReferrerEnum.SCAN_PROGRESS
            : pathname === "/scan/food"
              ? ReferrerEnum.SCAN_FOOD
              : ReferrerEnum.SCAN_INDEX;

        openAuthModal({
          title: "Sign in to continue",
          stateObject: {
            redirectPath: pathname,
            localUserId: userId,
            redirectQuery: searchParams.toString(),
            referrer,
          },
        });
        setIsLoading(false);
        return;
      }
      router.push("/auth");
    }

    if (referrer === "startButton") {
      router.push("/scan");
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
                icon={
                  <IconRocket
                    stroke={1.5}
                    className="icon icon__large"
                    style={{ marginRight: rem(6) }}
                  />
                }
                onClick={() => handleRedirect("startButton")}
              />
            )}
            {displayComponent === "signInButton" && (
              <Button
                aria-label="sign in button"
                loading={isLoading}
                disabled={isLoading}
                onClick={() => handleRedirect("signInButton")}
              >
                <IconDoorEnter stroke={1.75} className="icon" style={{ marginRight: rem(6) }} />
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
                  <UserButton avatar={avatar || null} name={name} handleSignOut={handleSignOut} />
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
        }}
      >
        <DrawerNavigation closeDrawer={close} handleSignOut={handleSignOut} />
      </Drawer>
    </>
  );
}

export default memo(Header);
