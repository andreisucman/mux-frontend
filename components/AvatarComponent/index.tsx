import React, { useEffect, useState } from "react";
import cn from "classnames";
import Avatar, { genConfig } from "react-nice-avatar";
import classes from "./AvatarComponent.module.css";

type Props = {
  avatar?: { [key: string]: any } | null;
  customStyles?: { [key: string]: any };
  size?: "xs" | "sm" | "md";
};

export default function AvatarComponent({ avatar, size = "md", customStyles }: Props) {
  const [config, setConfig] = useState<{ [key: string]: any }>();

  useEffect(() => {
    if (!avatar) return;
    const avatarConfig = genConfig(avatar);
    setConfig(avatarConfig);
  }, [avatar]);

  return (
    config && (
      <Avatar
        {...config}
        style={customStyles ? customStyles : {}}
        className={cn(classes.container, {
          [classes.small]: size === "xs",
          [classes.medium]: size === "sm",
        })}
      />
    )
  );
}
