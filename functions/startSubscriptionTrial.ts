import { modals } from "@mantine/modals";
import { OnCreateRoutineClickProps } from "@/context/CreateRoutineContext";
import callTheServer from "./callTheServer";

type Props = {
  subscriptionName: "improvement" | "advisor" | "analyst" | "peek";
  onComplete?: (args: OnCreateRoutineClickProps) => void;
};

export default async function startSubscriptionTrial({ subscriptionName, onComplete }: Props) {
  try {
    const response = await callTheServer({
      endpoint: "startSubscriptionTrial",
      method: "POST",
      body: { subscriptionName },
    });

    if (response.status === 200) {
      modals.closeAll();
      if (onComplete) onComplete({ isSubscriptionActive: true, isTrialUsed: true });
    }
  } catch (err) {
    console.log("Error in startSubscriptionTrial: ", err);
  }
}
