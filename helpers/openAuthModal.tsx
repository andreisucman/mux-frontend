import React from "react";
import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import AuthForm from "@/app/auth/AuthForm";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import { SignInStateType } from "@/functions/signIn";

type Props = {
  title: string;
  referrer: ReferrerEnum;
  stateObject?: SignInStateType;
  customStyles?: React.CSSProperties;
};
export default async function openAuthModal({ title, stateObject, referrer, customStyles }: Props) {
  modals.openContextModal({
    modal: "general",
    centered: true,
    title: (
      <Title order={5} component={"p"}>
        {title}
      </Title>
    ),
    innerProps: (
      <AuthForm stateObject={stateObject} customStyles={customStyles} referrer={referrer} />
    ),
  });
}
