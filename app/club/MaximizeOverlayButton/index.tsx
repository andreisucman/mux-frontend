import React, { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, Group, rem } from "@mantine/core";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./MaximizeOverlayButton.module.css";

type Props = {
  notPurchased: string[];
  showOverlayComponent: "none" | "maximizeButton" | "purchaseOverlay" | "showOtherRoutinesButton";
  setShowOverlayComponent: React.Dispatch<
    React.SetStateAction<"none" | "maximizeButton" | "purchaseOverlay" | "showOtherRoutinesButton">
  >;
};

export default function MaximizeOverlayButton({
  notPurchased,
  showOverlayComponent,
  setShowOverlayComponent,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const styles = { maxWidth: rem(300), margin: "auto" };

  const handleShowOverlay = useCallback(() => {
    if (showOverlayComponent === "showOtherRoutinesButton") {
      const [part, concern] = notPurchased[0].split("-");
      const newQuery = modifyQuery({
        params: [
          { name: "part", value: part, action: "replace" },
          { name: "concern", value: concern, action: "replace" },
        ],
      });
      router.push(`${pathname}${newQuery ? `?${newQuery}` : ""}`);
    }
    setShowOverlayComponent("purchaseOverlay");
  }, [notPurchased, showOverlayComponent]);

  return (
    <Group className={classes.container}>
      <Button style={styles} onClick={handleShowOverlay}>
        See info card
      </Button>
    </Group>
  );
}
