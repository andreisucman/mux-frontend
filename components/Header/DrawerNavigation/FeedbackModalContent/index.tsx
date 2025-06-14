import React, { useState } from "react";
import { IconPhoto } from "@tabler/icons-react";
import { Alert, Button, FileInput, rem, Stack } from "@mantine/core";
import TextareaComponent from "@/components/TextAreaComponent";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";

const defaultMessage =
  "Get cash reward for each error that you report. The reward will be added to your Club balance and paid out to your connected bank account.";
const imageExtensions = ["png", "jpg", "webp"];

export default function FeedbackModalContent() {
  const [message, setMessage] = useState(defaultMessage);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmitFeedback = async () => {
    if (isLoading) return;
    const body: { [key: string]: any } = { text };
    setIsLoading(true);

    if (files) {
      const urls: string[] = await uploadToSpaces({ itemsArray: files, imageSize: 1024 });

      const images = urls.filter((url) => {
        const parts = url.split(".");
        const extension = parts[parts.length - 1].toLowerCase();
        return imageExtensions.includes(extension);
      });
      const videos = urls.filter((url) => !images.includes(url));

      body.screenShots = images;
      body.videos = videos;
    }

    const response = await callTheServer({ endpoint: "submitFeedback", method: "POST", body });
    setIsLoading(false);

    if (response.status === 200) {
      if (response.error) {
        setMessage(response.error);
        setFiles([]);
        return;
      }
      setMessage(response.message);
      setFiles([]);
      setText("");
      setMessage("Thank you. We'll analyze your report within 7 days and inform you.");
    }
  };

  return (
    <Stack>
      <Alert p="0.5rem 1rem">{message}</Alert>
      <TextareaComponent
        text={text}
        placeholder={
          "Example 1: When I click the ... button the screen never finishes loading. I use Safari on Iphone XR. Example 2: I think it would be great if there was a way to... because for me it's very important to have a... Example 3: I think that the screen ... is very confusing. I was expecting to find ... there."
        }
        customStyles={{ minHeight: rem(250) }}
        setText={setText}
      />
      <FileInput
        accept="image/*,video/*"
        placeholder="Files (optional)"
        onChange={setFiles}
        value={files}
        leftSection={<IconPhoto size={18} />}
        multiple
        clearable
      />
      <Button
        ml="auto"
        loading={isLoading}
        disabled={isLoading || !text.trim()}
        onClick={handleSubmitFeedback}
      >
        Send
      </Button>
    </Stack>
  );
}
