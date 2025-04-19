import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import Link from "@/helpers/custom-router/patch-router/link";
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
        if (response.error === "scan") {
          openErrorModal({
            title: "Please scan yourself",
            description: (
              <Text>
                You need to scan your face first. Click{" "}
                <Link href="/select-concerns?part=face" style={{ textDecoration: "underline" }}>
                  here
                </Link>{" "}
                to start.
              </Text>
            ),
          });
          return;
        }
        openErrorModal({ description: response.error });
        return;
      }

      modals.closeAll();
      if (onComplete) onComplete({ isSubscriptionActive: true, isTrialUsed: true });
    }
  } catch (err) {}
}
