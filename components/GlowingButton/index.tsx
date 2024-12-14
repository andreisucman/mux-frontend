import React, { memo, useState } from "react";
import cn from "classnames";
import { Loader, Stack, UnstyledButton } from "@mantine/core";
import classes from "./GlowingButton.module.css";

type Props = {
  addGradient?: boolean;
  text: string;
  icon?: any;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick: (props?: any) => any;
  buttonStyles?: { [key: string]: any };
  containerStyles?: { [key: string]: any };
  overlayStyles?: { [key: string]: any };
};

function GlowingButton({
  text,
  icon,
  addGradient = true,
  disabled,
  containerStyles,
  overlayStyles,
  buttonStyles,
  children,
  onClick,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    onClick();
    const tId = setTimeout(() => {
      setIsLoading(false);
      clearTimeout(tId);
    }, 10000);
  };

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
        disabled={disabled || isLoading}
        className={cn(classes.button, {
          [classes.disabled]: disabled || isLoading,
        })}
        onClick={handleClick}
        style={buttonStyles ? buttonStyles : {}}
      >
        {isLoading ? (
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
