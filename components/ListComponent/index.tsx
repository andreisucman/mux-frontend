"use client";

import React, { useRef } from "react";
import cn from "classnames";
import { MasonryScroller, useContainerPosition, usePositioner, useResizeObserver } from "masonic";
import { useViewportSize } from "@mantine/hooks";
import classes from "./ListComponent.module.css";

type Props = {
  rowGutter?: number;
  items: any[];
  render: any;
  className?: string;
};

export default function ListComponent({ rowGutter, items, className, render }: Props) {
  const containerRef = useRef(null);
  let { width: windowWidth, height: windowHeight } = useViewportSize();
  const { offset, width } = useContainerPosition(containerRef, [windowWidth, windowHeight]);

  const itemCounter = useRef<number>(items.length);

  const positioner = usePositioner({ width, rowGutter, columnCount: 1 }, [
    items.length < itemCounter.current,
  ]);

  itemCounter.current = items.length;

  const resizeObserver = useResizeObserver(positioner);

  return (
    <MasonryScroller
      containerRef={containerRef}
      resizeObserver={resizeObserver}
      positioner={positioner}
      height={windowHeight}
      offset={offset}
      items={items}
      render={render}
      className={cn(classes.container, className)}
    />
  );
}
