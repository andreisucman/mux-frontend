import { rem, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { TypeEnum } from "@/types/global";
import AddATaskContainer from "./AddATaskContainer";

export default function openCreateNewTask(
  type: TypeEnum,
  handleSaveTask: (...args: any) => Promise<void>,
  onClose?: () => void
) {
  modals.openContextModal({
    centered: true,
    modal: "general",
    size: "auto",
    title: <Title order={5}>Add a {type} improvement task</Title>,
    innerProps: <AddATaskContainer type={type} handleSaveTask={handleSaveTask} />,
    styles: {
      content: { width: "100%", height: "auto", maxWidth: rem(400) },
    },
    onClose,
  });
}
