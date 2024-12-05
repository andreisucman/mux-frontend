import React from "react";
import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import AuthForm from "@/app/auth/AuthForm";
import { SignInStateType } from "@/functions/signIn";

type Props = {
  title: string;
  formType: "login" | "registration";
  stateObject?: SignInStateType;
  customStyles?: React.CSSProperties;
  showTos: boolean;
};
export default async function openAuthModal({
  title,
  formType,
  stateObject,
  customStyles,
  showTos,
}: Props) {
  modals.openContextModal({
    modal: "general",
    centered: true,
    title: (
      <Title order={5} component={"p"}>
        {title}
      </Title>
    ),
    innerProps: (
      <AuthForm
        formType={formType}
        stateObject={stateObject}
        customStyles={customStyles}
        showTos={showTos}
      />
    ),
  });
}
