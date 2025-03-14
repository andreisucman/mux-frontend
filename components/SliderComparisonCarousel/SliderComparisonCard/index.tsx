import React from "react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import classes from "./SliderComparisonCard.module.css";

type Props = {
  srcOne: string;
  srcTwo: string;
};

export default function SliderComparisonCard({ srcOne, srcTwo }: Props) {
  return (
    <div className={classes.container}>
      <ReactCompareSlider
        className={classes.slider}
        style={{ width: "100%", flex: 1 }}
        itemOne={
          <ReactCompareSliderImage
            src={srcTwo}
            alt="Image one"
            style={{ objectFit: "contain", objectPosition: "center" }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={srcOne}
            alt="Image two"
            style={{ objectFit: "contain", objectPosition: "center" }}
          />
        }
      />
    </div>
  );
}
