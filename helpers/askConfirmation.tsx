import { Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";

type AskConfirmationProps = {
  title: string;
  body: string;
  labels?: { confirm: string; cancel: string };
  onConfirm: () => void;
  onCancel?: () => void;
};

const askConfirmation = ({ title, body, labels, onConfirm, onCancel }: AskConfirmationProps) => {
  modals.openConfirmModal({
    title: (
      <Title order={5} component={"p"}>
        {title}
      </Title>
    ),
    centered: true,
    classNames: { overlay: "overlay" },
    children: <Text>{body}</Text>,
    labels: labels || { confirm: "Yes", cancel: "No" },
    onConfirm,
    onCancel,
  });
};

export default askConfirmation;
