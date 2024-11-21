import { modals } from "@mantine/modals";

type OpenErrorModalProps = {
  title?: string;
  description?: string;
  onClose?: () => void;
};

export default function openErrorModal(props?: OpenErrorModalProps) {
  const { title, description, onClose } = props as OpenErrorModalProps;

  try {
    modals.open({
      centered: true,
      title: title || "🚨 Ups, this didn't work!",
      children: description || "Please try again and inform us if the error persists",
      onClose,
    });
  } catch (err) {
    console.log("Error in openErrorModal: ", err);
  }
}
