import React, { memo } from "react";
import cn from "classnames";
import { Loader, UnstyledButton } from "@mantine/core";
import classes from "./GlowingButton.module.css";

type Props = {
  addGradient?: boolean;
  text: string;
  icon?: any;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  elementId?: string;
  iconPosition?: "left" | "right";
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
  elementId,
  iconPosition = "left",
  containerStyles,
  overlayStyles,
  buttonStyles,
  children,
  onClick,
}: Props) {
  return (
    <div className={classes.container} style={containerStyles ? containerStyles : {}}>
      <div
        className={cn(classes.button, classes.gradient, {
          gradientSpin: addGradient,
          [classes.disabled]: disabled,
        })}
        style={overlayStyles ? overlayStyles : {}}
      />
      <button
        id={elementId}
        disabled={disabled}
        className={cn(classes.button, {
          [classes.loading]: loading,
          [classes.disabled]: disabled,
        })}
        onClick={onClick}
        style={buttonStyles ? buttonStyles : {}}
      >
        {loading ? (
          <Loader m="0 auto" size="sm" color="white" />
        ) : (
          <>
            {iconPosition === "left" && icon}
            {text}
            {children && children}
            {iconPosition === "right" && icon}
          </>
        )}
      </button>
    </div>
  );
}

export default memo(GlowingButton);
