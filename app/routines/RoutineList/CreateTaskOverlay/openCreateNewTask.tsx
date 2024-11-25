import { rem, Text } from "@mantine/core";
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
    title: <Text fw={600}>Add a {type} improvement task</Text>,
    innerProps: <AddATaskContainer type={type} handleSaveTask={handleSaveTask} />,
    styles: {
      content: { width: "100%", height: "auto", maxWidth: rem(400) },
    },
    onClose,
  });
}
