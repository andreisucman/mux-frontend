"use client";

import React, { useRef } from "react";
import { MasonryScroller, useContainerPosition, usePositioner, useResizeObserver } from "masonic";
import { useViewportSize } from "@mantine/hooks";

type Props = {
  columnCount?: number;
  maxColumnCount?: number;
  columnGutter?: number;
  columnWidth: number;
  items: any[];
  render: any;
};

export default function MasonryComponent({
  columnCount,
  maxColumnCount,
  columnGutter,
  columnWidth,
  items,
  render,
}: Props) {
  const containerRef = useRef(null);
  const { width: windowWidth, height: windowHeight } = useViewportSize();
  const { offset, width } = useContainerPosition(containerRef, [windowWidth, windowHeight]);

  const positioner = usePositioner(
    { width, columnWidth, columnCount, maxColumnCount, columnGutter },
    [items.length]
  );

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
    />
  );
}
