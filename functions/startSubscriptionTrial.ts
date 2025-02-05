import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

type Props = {
  subscriptionName: "improvement" | "advisor" | "peek";
  onComplete?: (args: any) => void;
};

export default async function startSubscriptionTrial({ subscriptionName, onComplete }: Props) {
  try {
    const response = await callTheServer({
      endpoint: "startSubscriptionTrial",
      method: "POST",
      body: { subscriptionName },
    });

    if (response.status === 200) {
      if (response.error) {
        openErrorModal({ description: response.error });
        return;
      }
      
      modals.closeAll();
      if (onComplete) onComplete({ isSubscriptionActive: true, isTrialUsed: true });
    }
  } catch (err) {}
}
