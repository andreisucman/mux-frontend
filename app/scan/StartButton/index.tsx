import React from "react";
import Image from "next/image";
import { Overlay, Title, UnstyledButton } from "@mantine/core";
import classes from "./StartButton.module.css";

type Props = {
  title: string;
  overlayChildren?: React.ReactNode;
  onClick: () => void;
};

export default function StartButton({ onClick, overlayChildren, title }: Props) {
  return (
    <UnstyledButton className={classes.container} onClick={onClick}>
      <div className={classes.imageWrapper}>
        <Image
          src="https://placehold.co/160x213"
          className={classes.image}
          alt=""
          width={180}
          height={240}
        />
        {overlayChildren && (
          <Overlay blur={5} color="000" backgroundOpacity={0.25} children={overlayChildren} />
        )}
      </div>
      <Title className={classes.title} order={4}>
        {title}
      </Title>
    </UnstyledButton>
  );
}
