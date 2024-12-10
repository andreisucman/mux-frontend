import React, { memo } from "react";
import cn from "classnames";
import { Loader, Stack, UnstyledButton } from "@mantine/core";
import classes from "./GlowingButton.module.css";

type Props = {
  addGradient?: boolean;
  text: string;
  icon?: any;
  fontSize?: "sm" | "md";
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: (props?: any) => any;
  buttonStyles?: { [key: string]: any };
  containerStyles?: { [key: string]: any };
  overlayStyles?: { [key: string]: any };
};

function GlowingButton({
  text,
  icon,
  fontSize = "sm",
  loading,
  addGradient = true,
  disabled,
  containerStyles,
  overlayStyles,
  buttonStyles,
  children,
  onClick,
}: Props) {
  return (
    <Stack className={classes.container} style={containerStyles ? containerStyles : {}}>
      <div
        className={cn(classes.button, classes.gradient, {
          gradientSpin: addGradient,
          [classes.disabled]: disabled,
        })}
        style={overlayStyles ? overlayStyles : {}}
      />
      <UnstyledButton
        size="sm"
        disabled={disabled}
        className={cn(classes.button, classes.sm, {
          [classes.disabled]: disabled,
          [classes.md]: fontSize === "md",
        })}
        onClick={onClick}
        style={buttonStyles ? buttonStyles : {}}
      >
        {loading ? (
          <Loader color="white" size="sm" />
        ) : (
          <>
            {icon}
            {text}
            {children && children}
          </>
        )}
      </UnstyledButton>
    </Stack>
  );
}

export default memo(GlowingButton);
