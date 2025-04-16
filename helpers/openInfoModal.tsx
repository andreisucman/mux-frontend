import React from "react";
import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";

type Props = {
  title?: string;
  description?: string | React.ReactNode;
  onClose?: () => void;
};

export default function openInfoModal(props?: Props) {
  const { title, description, onClose } = props || {};

  try {
    modals.open({
      centered: true,
      classNames: { overlay: "overlay" },
      title: (
        <Title order={5} component={"p"}>
          {title}
        </Title>
      ),
      children: description,
      onClose,
    });
  } catch (err) {
    console.log("Error in openInfoModal: ", err);
  }
}
