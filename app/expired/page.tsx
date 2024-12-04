"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button, Stack, Title } from "@mantine/core";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import expiredImage from "@/public/assets/clock_and_cat.svg";
import classes from "./expired.module.css";

export default function Expired() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type");

  const handleNavigation = () => {
    const previousURL = document.referrer;
    const currentDomain = window.location.origin;

    if (type) {
      switch (type) {
        case "password":
          router.replace("/auth");
          break;
        default:
          router.replace("/auth");
      }
    } else if (previousURL && new URL(previousURL).origin === currentDomain) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <Stack className={`${classes.container} smallPage`}>
      <div className={classes.inner}>
        <Image className={classes.image} src={expiredImage.src} alt="" width={500} height={500} />
        <Stack className={classes.content}>
          <Title order={1} className={classes.title}>This link expired</Title>
          <Button variant="default" onClick={handleNavigation}>
            Return
          </Button>
        </Stack>
      </div>
    </Stack>
  );
}
