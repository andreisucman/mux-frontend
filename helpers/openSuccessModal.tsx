import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";

type Props = {
  title?: string;
  description?: string;
  onClose?: () => void;
};

export default function openSuccessModal(props?: Props) {
  const { title, description, onClose } = props || { title: "✔️ Success!" };

  try {
    modals.open({
      centered: true,
      title: <Title order={5}>{title}</Title>,
      children: description,
      onClose,
    });
  } catch (err) {
    console.log("Error in openSuccessModal: ", err);
  }
}
