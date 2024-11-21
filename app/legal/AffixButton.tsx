import React from "react";
import { IconArrowUp } from "@tabler/icons-react";
import { Affix, Button, rem, Transition } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";

export default function AffixButton() {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Transition transition="slide-up" mounted={scroll.y > 0}>
        {(transitionStyles) => (
          <Button
            variant="default"
            leftSection={<IconArrowUp style={{ width: rem(16), height: rem(16) }} />}
            aria-label="scroll to top button"
            style={transitionStyles}
            onClick={() => scrollTo({ y: 0 })}
          >
            Up
          </Button>
        )}
      </Transition>
    </Affix>
  );
}
