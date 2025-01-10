"use client";

import { CSSProperties, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { IconRocket, IconTargetArrow } from "@tabler/icons-react";
import { ActionIcon, Drawer, Group, rem, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createSpotlight } from "@mantine/spotlight";
import GlowingButton from "@/components/GlowingButton";
import DrawerNavigation from "@/components/Header/DrawerNavigation";
import Logo from "@/components/Header/Logo";
import { UserContext } from "@/context/UserContext";
import { clearCookies } from "@/helpers/cookies";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import { deleteFromLocalStorage } from "@/helpers/localStorage";
import AvatarComponent from "../AvatarComponent";
import SearchButton from "../SearchButton";
import Burger from "./Burger";
import UserButton from "./UserButton";
import classes from "./Header.module.css";

const showStartButtonRoutes = [
  "/",
  "/solutions",
  "/rewards",
  "/reviews",
  "/legal/terms",
  "/legal/privacy",
  "/legal/club",
];

const [spotlightStore, userSpotlight] = createSpotlight();

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [navigationDrawerOpen, { toggle, close }] = useDisclosure(false);
  const { status, userDetails, setStatus, setUserDetails } = useContext(UserContext);
  const [displayComponent, setDisplayComponent] = useState("none");

  const { avatar, name } = userDetails || {};

  const showStartButton = useMemo(
    () => showStartButtonRoutes.some((route) => pathname === route),
    [pathname]
  );

  const headerStyles = useMemo(() => {
    return status ? { visibility: "visible" } : { visibility: "hidden" };
  }, [status]);

  const handleRedirect = () => {
    if (isLoading) return;
    setIsLoading(true);
    router.push("/scan");
  };

  const handleSignOut = useCallback(async () => {
    clearCookies();
    setStatus("unauthenticated");
    close();
  }, []);

  const constructUserActions = (list: { avatar: any; name: string }[]) => {
    const actions = list.map((item) => ({
      id: item.name as string,
      label: item.name,
      leftSection: <AvatarComponent avatar={item.avatar} size="sm" />,
      onClick: () => router.push(`/club/${item.name}`),
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
    } else {
      setDisplayComponent("default");
    }
  }, [status, showStartButton]);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <>
      <header className={classes.container}>
        <div className={classes.wrapper}>
          <Logo />
          <Group className={classes.navigation} style={headerStyles as CSSProperties}>
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
                <ActionIcon
                  variant="default"
                  size="lg"
                  visibleFrom={status === "authenticated" ? undefined : "xs"}
                  onClick={() => router.push("/")}
                  aria-label="go to results page button"
                >
                  <IconTargetArrow stroke={1.25} className="icon icon__large" />
                </ActionIcon>
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
                    onClick={handleRedirect}
                  />
                )}
                {displayComponent === "userButton" && (
                  <UserButton avatar={avatar || null} name={name} />
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
