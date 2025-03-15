import { Group, Text, Title } from "@mantine/core";
import openPaymentModal from "@/helpers/openPaymentModal";
import { UserDataType } from "@/types/global";
import createCheckoutSession from "./createCheckoutSession";
import fetchUserData from "./fetchUserData";

type Props = {
  redirectUrl: string;
  setUserDetails: React.Dispatch<React.SetStateAction<Partial<UserDataType | null>>>;
};

const createBuyScanSession = ({ redirectUrl, setUserDetails }: Props) => {
  openPaymentModal({
    title: "Add scan analysis",
    price: (
      <Group className="priceGroup">
        <Title order={3}>$1</Title>/<Text>analysis</Text>
      </Group>
    ),
    description: "To get scores and feedback you need to have a scan",
    isCentered: true,
    modalType: "scan",
    onClick: () =>
      createCheckoutSession({
        type: "platform",
        body: {
          priceId: process.env.NEXT_PUBLIC_SCAN_PRICE_ID!,
          redirectUrl,
          cancelUrl: redirectUrl,
          mode: "payment",
        },
        setUserDetails,
      }),
    buttonText: "Buy scan analysis",
    onClose: () => {
      fetchUserData({ setUserDetails });
    },
  });
};

export default createBuyScanSession;
