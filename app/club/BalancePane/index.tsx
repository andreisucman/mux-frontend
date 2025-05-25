import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import { ActionIcon, Alert, Button, Group, Stack, Text, Title, Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { nprogress } from "@mantine/nprogress";
import SelectCountry from "@/components/SelectCountry";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import { UserDataType } from "@/types/global";
import classes from "./BalancePane.module.css";

function BalancePane() {
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);
  const clickOutsideRef = useClickOutside(() => setOpenTooltip(false));

  const { club, country } = userDetails || {};
  const { payouts } = club || {};
  const { balance, payoutsEnabled, disabledReason, detailsSubmitted, connectId, minPayoutAmount } =
    payouts || {};

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

  useEffect(() => {
    return () => {
      setIsLoading(false);
      nprogress.complete();
    };
  }, []);

  const displayBalance = useMemo(() => {
    return (
      <Group className={classes.balance}>
        <Title order={2} className={classes.amount}>
          <Text className={classes.currency}>USD</Text>
          {balance}
        </Title>
      </Group>
    );
  }, [isLoading, balance, country, minPayoutAmount]);

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

  const minPayoutNotice = useMemo(() => {
    let amountNotice = "";
    if (country) amountNotice += `The minimum payout for ${country} is USD ${minPayoutAmount}.00.`;
    amountNotice += ` The balance is paid out to your bank account automatically. You can change the bank account in the wallet.`;
    return amountNotice;
  }, [country, minPayoutAmount]);

  return (
    <Stack className={classes.container}>
      <Group className={classes.header}>
        <Text c="dimmed" size="sm">
          Current balance
        </Text>
        <Group gap={8}>
          <Tooltip
            opened={openTooltip}
            label={minPayoutNotice}
            ref={clickOutsideRef}
            onClick={() => setOpenTooltip((prev) => !prev)}
            multiline
          >
            <ActionIcon variant="default">
              <IconInfoCircle size={16} />
            </ActionIcon>
          </Tooltip>
          <Button
            variant={"default"}
            size="compact-sm"
            disabled={!connectId}
            style={{ position: "relative", zIndex: 1 }}
            onClick={() => router.push("/club/wallet")}
          >
            Go to wallet
          </Button>
        </Group>
      </Group>
      {alert && <Stack>{alert}</Stack>}
      <Stack className={classes.stack}>{displayBalance}</Stack>
    </Stack>
  );
}

export default memo(BalancePane);
