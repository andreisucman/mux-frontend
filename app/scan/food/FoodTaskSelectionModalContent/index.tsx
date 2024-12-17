import React from "react";
import { Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import imageUrlToBase64 from "@/functions/imageUrlToBase64";
import { useRouter } from "@/helpers/custom-router";
import { saveToIndexedDb } from "@/helpers/indexedDb";
import modifyQuery from "@/helpers/modifyQuery";
import { TaskType } from "@/types/global";
import FoodTaskSelectionRow from "../FoodTaskSelectionRow";

type Props = {
  tasks: TaskType[];
  foodUrl: string;
};

export default function FoodTaskSelectionModalContent({ tasks, foodUrl }: Props) {
  const router = useRouter();

  const handleClick = async (task: TaskType) => {
    let base64Image: string | null = foodUrl;
    const isAbsolute = foodUrl.startsWith("https://");

    const { _id, requiredSubmissions } = task;

    if (isAbsolute) {
      base64Image = await imageUrlToBase64(foodUrl);
    }

    if (base64Image) {
      saveToIndexedDb("proofImage", base64Image);

      const firstUnsubmitted = requiredSubmissions?.find((s) => !s.isSubmitted);

      if (firstUnsubmitted) {
        const { name, submissionId } = firstUnsubmitted;
        const query = modifyQuery({
          params: [
            { name: "submissionName", value: name, action: "replace" },
            { name: "submissionId", value: submissionId, action: "replace" },
            { name: "analysisId", value: null, action: "delete" },
          ],
        });
        router.push(`/upload-proof/${_id}?${query}`);
        modals.closeAll();
      }
    }
  };

  return (
    <Stack>
      {tasks.map((task) => (
        <FoodTaskSelectionRow key={task._id} task={task} onClick={handleClick} />
      ))}
    </Stack>
  );
}
