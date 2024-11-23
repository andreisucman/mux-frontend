"use client";

import { memo, useCallback, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import { IconRocket, IconScan, IconTargetArrow } from "@tabler/icons-react";
import { ActionIcon, Burger, Drawer, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import GlowingButton from "@/components/GlowingButton";
import DrawerNavigation from "@/components/Header/DrawerNavigation";
import Logo from "@/components/Header/Logo";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import classes from "./Header.module.css";

const hideStartButtonRoutes = ["/scan", "/review", "/accept", "/wait", "/analysis", "/auth"];

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [navigationDrawerOpen, { toggle, close }] = useDisclosure(false);
  const { status, userDetails } = useContext(UserContext);
  const { email } = userDetails || {};

  const handleAppRedirect = useCallback(() => {
    let url;

    if (status === "authenticated") {
      url = "/";
    } else {
      if (email) {
        url = "/auth";
      } else {
        url = "/start";
      }
    }
    router.push(url);
  }, [status, email]);

  const hideStartButton = useMemo(
    () => hideStartButtonRoutes.some((route) => pathname.startsWith(route)),
    [pathname]
  );

  return (
    <>
      <header className={classes.container}>
        <div className={classes.wrapper}>
          <Logo />
          <Group className={classes.navigation}>
            <ActionIcon
              variant="default"
              visibleFrom={status === "authenticated" ? undefined : "xs"}
              onClick={() => router.push("/")}
              className={classes.button}
              aria-label="go to results page button"
            >
              <IconTargetArrow stroke={1.25} className="icon icon__large" />
            </ActionIcon>
            {status !== "authenticated" && !hideStartButton && (
              <GlowingButton
                text="Start"
                aria-label="start analysis button"
                disabled={hideStartButton}
                icon={<IconRocket stroke={1.5} className="icon icon__large" />}
                onClick={handleAppRedirect}
              />
            )}
            {status === "authenticated" && (
              <ActionIcon
                variant="default"
                onClick={() => router.push("/scan")}
                className={classes.button}
                aria-label="scan appearance button"
              >
                <IconScan stroke={1.25} className="icon icon__large" />
              </ActionIcon>
            )}

            <Burger onClick={toggle} />
          </Group>
        </div>
      </header>

      <Drawer
        position="right"
        size="xs"
        title="Navigation"
        opened={navigationDrawerOpen}
        onClose={close}
        onChange={toggle}
        classNames={{
          title: classes.drawerTitle,
          content: classes.drawerContent,
          body: classes.drawerBody,
        }}
      >
        <DrawerNavigation closeDrawer={close} />
      </Drawer>
    </>
  );
}

export default memo(Header);
