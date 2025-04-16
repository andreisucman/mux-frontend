"use client";

import React from "react";
import Image from "next/image";
import cn from "classnames";
import Link from "@/helpers/custom-router/patch-router/link";
import logoDarkSrc from "@/public/logo-dark.svg";
import logoLightSrc from "@/public/logo-light.svg";
import classes from "./Logo.module.css";

type Props = {
  customStyles?: {
    [key: string]: unknown;
  };
};

function Logo({ customStyles }: Props) {
  return (
    <Link href={"/"} className={classes.container} style={customStyles ? customStyles : {}}>
      <Image
        src={logoDarkSrc}
        width={190}
        height={32}
        alt="Muxout logo"
        className={cn(classes.logo, classes.dark)}
        priority={true}
      />
      <Image
        src={logoLightSrc}
        width={190}
        height={32}
        alt="Muxout logo"
        className={cn(classes.logo, classes.light)}
        priority={true}
      />
    </Link>
  );
}

export default Logo;
