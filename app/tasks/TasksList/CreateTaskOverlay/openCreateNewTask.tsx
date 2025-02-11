import { rem, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import AddATaskContainer from "./AddATaskContainer";

type OpenCreateNewTaskProps = {
  handleSaveTask: (...args: any) => Promise<void>;
  onCreateRoutineClick: (args?: any) => void;
  timeZone?: string;
  onClose?: () => void;
};

export default function openCreateNewTask({
  timeZone,
  handleSaveTask,
  onCreateRoutineClick,
  onClose,
}: OpenCreateNewTaskProps) {
  modals.openContextModal({
    centered: true,
    modal: "general",
    size: "auto",
    title: (
      <Title order={5} component={"p"}>
        Add a task
      </Title>
    ),
    innerProps: (
      <AddATaskContainer
        timeZone={timeZone}
        handleSaveTask={handleSaveTask}
        onCreateRoutineClick={onCreateRoutineClick}
      />
    ),
    styles: {
      content: { width: "100%", height: "auto", maxWidth: rem(400) },
    },
    onClose,
  });
}
