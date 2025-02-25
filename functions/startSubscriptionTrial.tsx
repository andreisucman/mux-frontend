import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Text, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

type Props = {
  subscriptionName: "improvement" | "advisor" | "peek";
  onComplete?: (args: any) => void;
  router: AppRouterInstance;
};

export default async function startSubscriptionTrial({
  subscriptionName,
  router,
  onComplete,
}: Props) {
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
            title: "🚨 Please scan yourself",
            description: (
              <Text>
                You need to scan your face first. Click{" "}
                <UnstyledButton
                  onClick={() => {
                    router.push("/scan/progress");
                    modals.closeAll();
                  }}
                  style={{ textDecoration: "underline" }}
                >
                  here
                </UnstyledButton>{" "}
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
