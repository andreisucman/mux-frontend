import React, { forwardRef } from "react";
import NextLink from "next/link";
import { onStart } from "@/helpers/custom-router/events";
import { shouldTriggerStartEvent } from "./should-trigger-start-event";

const Link = forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(
  function Link({ href = "", onClick, ...rest }, ref) {
    const isInternal = typeof href === "string" && href.startsWith("/");

    /* External links fall back to a plain <a>. */
    if (!isInternal) {
      return (
        <a href={href as string} onClick={onClick} ref={ref} {...rest} />
      );
    }

    return (
      <NextLink
        href={href}
        ref={ref}
        {...rest}
        onClick={(event) => {
          /* 1️⃣ user handler FIRST (may call preventDefault) */
          if (onClick) onClick(event);

          /* 2️⃣ only start if navigation will really happen */
          if (
            !event.defaultPrevented &&
            shouldTriggerStartEvent(href as string, event)
          ) {
            onStart();
          }
        }}
      />
    );
  }
);

export default Link;
