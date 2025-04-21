import FeedbackModalContent from "@/components/Header/DrawerNavigation/FeedbackModalContent";
import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";

const openFeedbackModal = () => {
  modals.openContextModal({
    centered: true,
    modal: "general",
    classNames: { overlay: "overlay" },
    innerProps: <FeedbackModalContent />,
    title: (
      <Title order={5} component={"p"}>
        Submit feedback
      </Title>
    ),
  });
};

export default openFeedbackModal;