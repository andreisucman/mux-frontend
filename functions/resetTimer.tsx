import { Group, Text, Title } from "@mantine/core";
import openPaymentModal from "@/helpers/openPaymentModal";
import createCheckoutSession from "./createCheckoutSession";
import fetchUserData from "./fetchUserData";

const openResetTimerModal = (
  type: "scan" | "suggestion",
  part: string,
  redirectUrl: string,
  setUserDetails: any
) => {
  const description =
    type === "scan"
      ? `You can scan your ${part} for free once a week.`
      : `You can get a ${part} routine suggestion once a week.`;

  const priceId =
    type === "scan"
      ? process.env.NEXT_PUBLIC_SCAN_PRICE_ID
      : process.env.NEXT_PUBLIC_SUGGESTION_PRICE_ID;

  openPaymentModal({
    title: `Reset ${part} ${type} timer`,
    price: (
      <Group className="priceGroup">
        <Title order={4}>$1</Title>/<Text>one time</Text>
      </Group>
    ),
    isCentered: true,
    modalType: type,
    buttonText: `Reset ${type} timer`,
    description: `${description} If you want more you can reset the timer now.`,
    onClick: () =>
      createCheckoutSession({
        type: "platform",
        body: {
          mode: "payment",
          priceId,
          redirectUrl,
          cancelUrl: redirectUrl,
          part,
        },
        setUserDetails,
      }),
    onClose: () => fetchUserData({ setUserDetails }),
  });
};

export default openResetTimerModal;
