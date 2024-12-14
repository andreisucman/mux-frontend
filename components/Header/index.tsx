"use client";

import { CSSProperties, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { IconRocket, IconTargetArrow } from "@tabler/icons-react";
import { ActionIcon, Drawer, Group, rem, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import GlowingButton from "@/components/GlowingButton";
import DrawerNavigation from "@/components/Header/DrawerNavigation";
import Logo from "@/components/Header/Logo";
import { UserContext } from "@/context/UserContext";
import { clearCookies } from "@/helpers/cookies";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import { deleteFromLocalStorage } from "@/helpers/localStorage";
import Burger from "./Burger";
import UserButton from "./UserButton";
import classes from "./Header.module.css";

const hideStartButtonRoutes = [
  "/scan",
  "/accept",
  "/wait",
  "/analysis",
  "/auth",
  "/verify-email",
  "/set-password",
  "/settings",
];

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [navigationDrawerOpen, { toggle, close }] = useDisclosure(false);
  const { status, userDetails, setStatus, setUserDetails } = useContext(UserContext);
  const [displayComponent, setDisplayComponent] = useState("none");

  const { club } = userDetails || {};
  const { avatar, payouts } = club || {};
  const { detailsSubmitted } = payouts || {};

  const hideStartButton = useMemo(
    () => hideStartButtonRoutes.some((route) => pathname.startsWith(route)),
    [pathname]
  );

  const headerStyles = useMemo(() => {
    return status ? { visibility: "visible" } : { visibility: "hidden" };
  }, [status]);

  useEffect(() => {
    if (status === "unknown") {
      setDisplayComponent("none");
    } else if (status === "authenticated") {
      setDisplayComponent("userButton");
    } else if (status === "unauthenticated" && !hideStartButton) {
      setDisplayComponent("startButton");
    } else {
      setDisplayComponent("default");
    }
  }, [status, hideStartButton]);

  const handleSignOut = useCallback(async () => {
    router.replace("/");
    clearCookies();
    deleteFromLocalStorage("userDetails");
    setStatus("unauthenticated");
    setUserDetails(null);
    close();
  }, []);

  return (
    <>
      <header className={classes.container}>
        <div className={classes.wrapper}>
          <Logo />
          <Group className={classes.navigation} style={headerStyles as CSSProperties}>
            {displayComponent !== "none" && (
              <>
                <ActionIcon
                  variant="default"
                  visibleFrom={status === "authenticated" ? undefined : "xs"}
                  onClick={() => router.push("/")}
                  className={classes.button}
                  aria-label="go to results page button"
                >
                  <IconTargetArrow stroke={1.25} className="icon icon__large" />
                </ActionIcon>
                {displayComponent === "startButton" && (
                  <GlowingButton
                    text="Start"
                    aria-label="start analysis button"
                    disabled={hideStartButton}
                    icon={
                      <IconRocket
                        stroke={1.5}
                        className="icon icon__large"
                        style={{ marginRight: rem(6) }}
                      />
                    }
                    onClick={() => router.push("/scan")}
                  />
                )}
                {displayComponent === "userButton" && (
                  <UserButton avatar={avatar || null} clubPayouts={payouts} />
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
