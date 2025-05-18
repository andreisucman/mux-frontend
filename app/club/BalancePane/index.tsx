import React, { memo, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { ConnectBalances, ConnectComponentsProvider } from "@stripe/react-connect-js";
import { IconInfoCircle } from "@tabler/icons-react";
import { Alert, Button, Group, Skeleton, Stack, Text, Title } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import SelectCountry from "@/components/SelectCountry";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import { UserDataType } from "@/types/global";
import classes from "./BalancePane.module.css";

type ConnectAppearance = Parameters<typeof loadConnectAndInitialize>[0]["appearance"];

export function makeAppearance(isDark: boolean): ConnectAppearance {
  return {
    overlays: "dialog",
    variables: isDark
      ? {
          colorBackground: "#272727",
          colorText: "#c9c9c9",
          colorSecondaryText: "#B5B5B5",
          colorPrimary: "#dc2d3c",
          borderRadius: "16px",
          fontFamily: "Open Sans, sans-serif",
          overlayBackdropColor: "#242424",
          buttonSecondaryColorBackground: "#B5B5B5",
        }
      : {
          colorBackground: "#f8f9fa",
          colorText: "#2e2e2d",
          colorSecondaryText: "#717171",
          colorPrimary: "#dc2d3c",
          borderRadius: "16px",
          fontFamily: "Open Sans, sans-serif",
          overlayBackdropColor: "#ffffff",
          buttonSecondaryColorBackground: "#FFFFFF",
        },
  };
}

function BalancePane() {
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const colorScheme = useColorScheme(undefined, { getInitialValueInEffect: false });
  const [stripeConnectInstance] = useState(() => {
    const fetchClientSecret = async () => {
      const response = await callTheServer({ endpoint: "getBalance", method: "GET" });

      if (response.status === 200) {
        return response.message;
      }
    };

    return loadConnectAndInitialize({
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      fetchClientSecret: fetchClientSecret,
      appearance: makeAppearance(colorScheme === "dark"),
    });
  });

  const { club, country } = userDetails || {};
  const { payouts } = club || {};
  const { connectId, payoutsEnabled, disabledReason, detailsSubmitted } = payouts || {};

  const openCountrySelectModal = useCallback(() => {
    setIsLoading(true);
    if (!country) {
      modals.openContextModal({
        modal: "general",
        centered: true,
        classNames: { overlay: "overlay" },
        innerProps: (
          <SelectCountry
            onClick={(newCountry: string) => handleSetCountryAndCreateAccount(newCountry)}
          />
        ),
        title: (
          <Title component={"p"} order={5}>
            Enter your country
          </Title>
        ),
      });
      setIsLoading(false);
      return;
    }

    handleCreateConnectAccount();
  }, [country]);

  const handleSetCountryAndCreateAccount = useCallback(async (newCountry: string) => {
    setIsLoading(true);

    const response = await callTheServer({
      endpoint: "changeCountry",
      method: "POST",
      body: { newCountry },
    });

    if (response.status === 200) {
      const { defaultClubPayoutData } = response.message;

      setUserDetails((prev: UserDataType) => ({
        ...prev,
        country: newCountry,
        club: { ...prev.club, payouts: defaultClubPayoutData },
      }));

      handleCreateConnectAccount();
      modals.closeAll();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleCreateConnectAccount = useCallback(async () => {
    setIsLoading(true);
    const response = await callTheServer({
      endpoint: "createConnectAccount",
      method: "POST",
    });

    if (response.status === 200) {
      if (response.error) {
        openErrorModal({ description: response.error });
        setUserDetails((prev: UserDataType) => ({ ...prev, country: null }));
        setIsLoading(false);
        return;
      }
      router.push(response.message);
    } else {
      openErrorModal({ description: response.error });
      setIsLoading(false);
    }
  }, []);

  const alert = useMemo(() => {
    const submittedNotEnabled = detailsSubmitted && !payoutsEnabled && !disabledReason;
    const isRejected = disabledReason === "rejected.other";

    if (!detailsSubmitted)
      return (
        <Alert
          p="0.5rem 1rem"
          variant="light"
          classNames={{ icon: classes.alertIcon }}
          icon={<IconInfoCircle size={20} />}
        >
          <Group gap={8}>
            Your withdrawals are inactive. To activate them add a bank account.
            <Button
              loading={isLoading}
              disabled={isLoading}
              ml="auto"
              size="compact-sm"
              onClick={openCountrySelectModal}
            >
              Add
            </Button>
          </Group>
        </Alert>
      );
    if (submittedNotEnabled)
      return (
        <Alert
          p="0.5rem 1rem"
          variant="light"
          classNames={{ icon: classes.alertIcon }}
          icon={<IconInfoCircle size={20} />}
        >
          <Stack gap={8}>We're checking your information.</Stack>
        </Alert>
      );

    if (isRejected)
      return (
        <Alert
          p="0.5rem 1rem"
          variant="light"
          classNames={{ icon: classes.alertIcon }}
          icon={<IconInfoCircle size={20} />}
        >
          <Stack gap={8}>
            Sorry, but we can't support your payments. Reach out to info@muxout.com if you have
            questions.
          </Stack>
        </Alert>
      );

    if (!payoutsEnabled && disabledReason)
      return (
        <Alert
          p="0.5rem 1rem"
          variant="light"
          classNames={{ icon: classes.alertIcon }}
          icon={<IconInfoCircle size={20} />}
        >
          <Stack gap={8}>Your payouts have been disabled. Check your wallet for more info.</Stack>
        </Alert>
      );
  }, [isLoading, detailsSubmitted, payoutsEnabled, disabledReason]);

  return (
    <Stack className={classes.container}>
      <Text c="dimmed" size="sm">
        Current balance
      </Text>
      {alert && <Stack>{alert}</Stack>}
      {connectId && (
        <Skeleton className="skeleton" visible={balanceLoading}>
          <Stack className={classes.wrapper}>
            <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
              <ConnectBalances onLoaderStart={() => setBalanceLoading(false)} />
            </ConnectComponentsProvider>
          </Stack>
        </Skeleton>
      )}
    </Stack>
  );
}

export default memo(BalancePane);
