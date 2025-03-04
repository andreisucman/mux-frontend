import React, { memo, useMemo } from "react";
import Image from "next/image";
import classes from "./ImageCardStack.module.css";

type Props = {
  images?: string[];
};

const ImageCardStack = ({ images }: Props) => {
  const cards = useMemo(() => {
    return images ? (
      images.map((image, index) => {
        const rotation = Math.floor(Math.random() * 30) - 30;

        return (
          <Image
            className={classes.image}
            key={index}
            src={image}
            alt={`Uploaded ${index}`}
            width={250}
            height={250}
            style={{
              transform: `translate(-50%,-50%) rotate(${rotation}deg)`,
            }}
          />
        );
      })
    ) : (
      <></>
    );
  }, [images?.length]);

  return <>{images && <div className={classes.container}>{cards}</div>}</>;
};

export default memo(ImageCardStack);
