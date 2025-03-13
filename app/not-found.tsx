"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button, Stack } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import notFoundImage from "@/public/assets/not-found.svg";
import classes from "./not-found.module.css";

export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    nprogress.cleanup();
  }, []);

  const handleNavigation = () => {
    const previousURL = document.referrer;
    const currentDomain = window.location.origin;

    if (previousURL && new URL(previousURL).origin === currentDomain) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <Stack className={`${classes.container} smallPage`}>
      <div className={classes.inner}>
        <Image className={classes.image} src={notFoundImage.src} alt="" width={800} height={800} />
        <div className={classes.content}>
          <Button variant="default" onClick={handleNavigation}>
            Return
          </Button>
        </div>
      </div>
    </Stack>
  );
}
