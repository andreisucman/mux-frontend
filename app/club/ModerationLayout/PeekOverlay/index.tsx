import React, { useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { Stack, Text } from "@mantine/core";
import PricingCard from "@/app/plans/PricingCard";
import { peekLicenseContent } from "@/app/plans/pricingData";
import { UserContext } from "@/context/UserContext";
import createCheckoutSession from "@/functions/createCheckoutSession";
import classes from "./PeekOverlay.module.css";

type Props = {
  description?: string;
};

export default function PeekOverlay({ description }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setUserDetails } = useContext(UserContext);

  return (
    <Stack className={classes.container}>
      {description && <Text className={classes.text}>{description}</Text>}
      <PricingCard
        buttonText="Add"
        content={peekLicenseContent}
        onClick={() =>
          createCheckoutSession({
            priceId: process.env.NEXT_PUBLIC_PEEK_PRICE_ID!,
            redirectPath: `${pathname}/${searchParams.toString()}`,
            cancelPath: `${pathname}/${searchParams.toString()}`,
            setUserDetails,
          })
        }
        icon={<IconPlus className="icon" />}
        price="19"
        name={"Peek License"}
        addGradient
      />
    </Stack>
  );
}
