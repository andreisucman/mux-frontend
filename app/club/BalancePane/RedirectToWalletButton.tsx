import React, { useCallback } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";

type Props = {
  variant: string;
};

export default function RedirectToWalletButton({ variant }: Props) {
  const router = useRouter();

  const redirectToWallet = useCallback(async () => {
    try {
      const response = await callTheServer({
        endpoint: "redirectToWallet",
        method: "POST",
        body: { redirectUrl: window.location.href },
      });

      if (response.status === 200) {
        router.push(response.message);
      }
    } catch (err) {
      console.log("Error in redirectToWallet: ", err);
    }
  }, []);

  return (
    <Button
      variant={variant}
      size="compact-sm"
      ml="auto"
      mb={2}
      mr={2}
      style={{ position: "relative", zIndex: 1 }}
      onClick={redirectToWallet}
    >
      Wallet
      <IconArrowUpRight className="icon icon__small" />
    </Button>
  );
}
