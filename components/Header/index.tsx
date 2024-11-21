"use client";

import { memo, useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import { IconBooks, IconRocket, IconTargetArrow } from "@tabler/icons-react";
import { ActionIcon, Burger, Drawer, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import GlowingButton from "@/components/GlowingButton";
import DrawerNavigation from "@/components/Header/DrawerNavigation";
import Logo from "@/components/Header/Logo";
import { UserContext } from "@/context/UserContext";
import classes from "./Header.module.css";

function Header() {
  const router = useRouter();
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

  return (
    <>
      <header className={classes.container}>
        <div className={classes.wrapper}>
          <Logo />
          <Group className={classes.navigation}>
            <ActionIcon
              variant="default"
              visibleFrom="xs"
              onClick={() => router.push("/")}
              className={classes.button}
              aria-label="solutions page button"
            >
              <IconTargetArrow stroke={1.25} className="icon icon__large" />
            </ActionIcon>
            <ActionIcon
              variant="default"
              visibleFrom="xs"
              onClick={() => router.push("/styles")}
              className={classes.button}
              aria-label="analyze style button"
            >
              <IconBooks stroke={1.25} className="icon icon__large" />
            </ActionIcon>
            <GlowingButton
              text="Start"
              icon={<IconRocket stroke={1.5} className="icon icon__large" />}
              onClick={handleAppRedirect}
            />

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
        <DrawerNavigation status={status} />
      </Drawer>
    </>
  );
}

export default memo(Header);
