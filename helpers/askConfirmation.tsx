import { Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";

type AskConfirmationProps = {
  title: string;
  body: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

const askConfirmation = ({ title, body, onConfirm, onCancel }: AskConfirmationProps) => {
  modals.openConfirmModal({
    title: (
      <Title order={5} component={"p"}>
        {title}
      </Title>
    ),
    centered: true,
    children: <Text>{body}</Text>,
    labels: { confirm: "Yes", cancel: "No" },
    onConfirm,
    onCancel,
  });
};

export default askConfirmation;
