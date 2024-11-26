import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";

type Props = {
  title?: string;
  description?: string;
  onClose?: () => void;
};

export default function openErrorModal(props?: Props) {
  const { title, description, onClose } = props || { title: "🚨 Ups, this didn't work!" };

  try {
    modals.open({
      centered: true,
      title: <Title order={5}>{title}</Title>,
      children: description || "Please try again and inform us if the error persists.",
      onClose,
    });
  } catch (err) {
    console.log("Error in openErrorModal: ", err);
  }
}
