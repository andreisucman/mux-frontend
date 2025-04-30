import React from "react";
import Image from "next/image";
import cn from "classnames";
import classes from "./SlidingImages.module.css";

const images = [
  "/assets/club_bg/1.webp",
  "/assets/club_bg/7.webp",
  "/assets/club_bg/6.webp",
  "/assets/club_bg/3.webp",
  "/assets/club_bg/2.webp",
  "/assets/club_bg/5.webp",
  "/assets/club_bg/4.webp",
];

export default function SlidingImages() {
  return (
    <div className={cn(classes.container, "scrollbar")}>
      <div className={classes.slider}>
        {images.map((i) => (
          <Image key={i} src={i} alt="" width={480} height={720} />
        ))}
      </div>
    </div>
  );
}
