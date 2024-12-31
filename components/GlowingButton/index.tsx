import React, { memo } from "react";
import cn from "classnames";
import { Loader, Stack, UnstyledButton } from "@mantine/core";
import classes from "./GlowingButton.module.css";

type Props = {
  addGradient?: boolean;
  text: string;
  icon?: any;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  onClick?: (props?: any) => void;
  buttonStyles?: { [key: string]: any };
  containerStyles?: { [key: string]: any };
  overlayStyles?: { [key: string]: any };
};

function GlowingButton({
  text,
  icon,
  addGradient = true,
  loading,
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
        disabled={disabled}
        className={cn(classes.button, {
          [classes.disabled]: disabled,
          [classes.loading]: loading,
        })}
        onClick={onClick}
        style={buttonStyles ? buttonStyles : {}}
      >
        {loading ? (
          <Loader m="0 auto" size="sm" color="white" />
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
