import { Group, Text, Title } from "@mantine/core";
import openPaymentModal from "@/helpers/openPaymentModal";
import { UserDataType } from "@/types/global";
import createCheckoutSession from "./createCheckoutSession";
import fetchUserData from "./fetchUserData";

type Props = {
  redirectUrl: string;
  cancelUrl: string;
  setUserDetails: React.Dispatch<React.SetStateAction<Partial<UserDataType | null>>>;
  setIsLoading: React.Dispatch<React.SetStateAction<any>>;
};

const createBuyScanSession = ({ redirectUrl, cancelUrl, setUserDetails, setIsLoading }: Props) => {
  openPaymentModal({
    title: "Add scan analysis",
    price: (
      <Group className="priceGroup">
        <Title order={4}>$1</Title>/<Text>analysis</Text>
      </Group>
    ),
    isCentered: true,
    modalType: "scan",
    description: "You have a free scan analysis every month. If you need more you can buy it now.",
    onClick: () =>
      createCheckoutSession({
        type: "platform",
        body: {
          priceId: process.env.NEXT_PUBLIC_SCAN_PRICE_ID!,
          redirectUrl,
          cancelUrl,
          mode: "payment",
        },
        setIsLoading,
        setUserDetails,
      }),
    buttonText: "Buy scan analysis",
    onClose: () => {
      fetchUserData({ setUserDetails });
    },
  });
};

export default createBuyScanSession;
