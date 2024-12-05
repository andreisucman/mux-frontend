import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import PhotoCapturer from "@/components/PhotoCapturer";

const openPhotoCapturer = (handleCapture: (base64string: string) => void) => {
  modals.openContextModal({
    modal: "general",
    centered: true,
    title: (
      <Title order={5} component={"p"}>
        Take a photo
      </Title>
    ),
    innerProps: <PhotoCapturer handleCapture={handleCapture} />,
  });
};

export default openPhotoCapturer;
