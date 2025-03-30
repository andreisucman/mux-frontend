import React from "react";
import Image from "next/image";
import cn from "classnames";
import { AvatarType } from "@/types/global";
import classes from "./AvatarComponent.module.css";

type Props = {
  avatar?: AvatarType | null;
  customStyles?: { [key: string]: any };
  size?: "xs" | "sm" | "md";
};

export default function AvatarComponent({ avatar, size = "md", customStyles }: Props) {
  const { image } = avatar || {};
  return (
    image && (
      <Image
        src={image}
        alt=""
        width={50}
        height={50}
        style={customStyles ? customStyles : {}}
        className={cn(classes.container, {
          [classes.small]: size === "xs",
          [classes.medium]: size === "sm",
        })}
      />
    )
  );
}
