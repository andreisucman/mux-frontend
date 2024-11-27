"use client";

import React from "react";
import Image from "next/image";
import Link from "@/helpers/custom-router/patch-router/link";
import logoSrc from "@/public/logo.webp";
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
        src={logoSrc}
        width={170}
        height={50}
        alt="MaxYouOut logo"
        className={classes.logo}
        priority={true}
      />
    </Link>
  );
}

export default Logo;
