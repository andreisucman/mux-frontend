import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import React from "react";

type Props = {
  title?: string;
  description?: string | React.ReactNode;
  onClose?: () => void;
};

export default function openSuccessModal(props?: Props) {
  const { title, description, onClose } = props || {};

  try {
    modals.open({
      centered: true,
      title: (
        <Title order={5} component={"p"}>
          {title || "✔️ Success!"}
        </Title>
      ),
      children: description,
      onClose,
    });
  } catch (err) {
    console.log("Error in openSuccessModal: ", err);
  }
}
