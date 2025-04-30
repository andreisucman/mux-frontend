import { rem, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import CreateRoutineContextProvider, { CreateRoutineContext } from "@/context/CreateRoutineContext";
import AddATaskContainer from "./AddATaskContainer";

type OpenCreateNewTaskProps = {
  handleSaveTask: (...args: any) => Promise<void>;
  onClose?: () => void;
};

export default function openCreateNewTask({ handleSaveTask, onClose }: OpenCreateNewTaskProps) {
  modals.openContextModal({
    centered: true,
    modal: "general",
    size: "auto",
    classNames: { overlay: "overlay" },
    title: (
      <Title order={5} component={"p"}>
        Add a task
      </Title>
    ),
    innerProps: (
      <CreateRoutineContextProvider>
        <AddATaskContainer handleSaveTask={handleSaveTask} />
      </CreateRoutineContextProvider>
    ),
    styles: {
      content: { width: "100%", height: "auto", maxWidth: rem(400) },
    },
    onClose,
  });
}
