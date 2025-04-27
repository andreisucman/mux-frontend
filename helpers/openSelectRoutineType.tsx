import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import SelectPartForRoutineModalContent from "@/context/CreateRoutineContext/SelectPartForRoutineModalContent";

const openSelectRoutineType = (parts: { part: string; date: Date | null }[]) => {
  modals.openContextModal({
    modal: "general",
    centered: true,
    classNames: { overlay: "overlay" },
    title: (
      <Title order={5} component={"p"}>
        Which routine to create?
      </Title>
    ),
    innerProps: <SelectPartForRoutineModalContent parts={parts} />,
  });
};

export default openSelectRoutineType;
